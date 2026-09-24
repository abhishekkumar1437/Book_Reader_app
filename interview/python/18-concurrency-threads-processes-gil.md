---
title: Concurrency — Threads, Processes & the GIL
part: Advanced
summary: The GIL and what it actually restricts, threads for I/O-bound work, processes for CPU-bound work, concurrent.futures, locks and races, queues, and how to answer "how would you speed this up".
---

## Three ways to do more than one thing

| Approach | Unit | Good for | Cost |
|---|---|---|---|
| **Threads** | OS threads sharing one process's memory | I/O-bound work: network calls, file reads, waiting on external services | GIL prevents parallel Python bytecode; shared state needs locks |
| **Processes** | Separate interpreters with separate memory | CPU-bound work: number crunching, parsing, image processing | Startup cost; data must be pickled to cross the boundary |
| **Async** (next chapter) | Coroutines on one thread, cooperative | Very many concurrent I/O operations (thousands of connections) | Only helps I/O; every library in the call chain must be async-aware |

The interview question is almost always: "this is slow, what would you do?" and the answer starts with "is it I/O-bound or CPU-bound?".

## The Global Interpreter Lock

CPython has one lock, the **GIL**, that a thread must hold to execute Python bytecode. Only one thread runs Python code at a time, so threads do not give parallel speed-up for CPU-bound Python. The GIL is **released** while a thread waits on I/O (sockets, files, `time.sleep`) and inside many C extensions (NumPy, hashing, compression), so threads still overlap I/O waits and some native work.

Why it exists: CPython's memory management uses reference counting, which is not thread-safe; a single lock is a simple, fast way to protect it and every C extension written against it. Removing it (a free-threaded build exists experimentally from 3.13) is a long project.

Consequences you should state:

- I/O-bound → threads (or async) work well; the GIL is released while waiting.
- CPU-bound → use processes (`multiprocessing`) or native code (NumPy, C extensions) that releases the GIL.
- The GIL does **not** make your code thread-safe. `count += 1` is several bytecodes and can be interrupted between them; you still need locks.

## Threads

```pycon
>>> import threading, time
>>> results = []
>>> def fetch(n):
...     time.sleep(0.05)                       # simulates waiting on I/O; the GIL is released here
...     results.append(n * n)
...
>>> start = time.perf_counter()
>>> threads = [threading.Thread(target=fetch, args=(i,)) for i in range(10)]
>>> for t in threads: t.start()
>>> for t in threads: t.join()               # wait for all
>>> sorted(results), time.perf_counter() - start < 0.4
([0, 1, 4, 9, 16, 25, 36, 49, 64, 81], True)
```

Ten sleeps of 50 ms finished in well under 500 ms because they overlapped. Replace `sleep` with an HTTP request and this is exactly how a threaded downloader works.

`daemon=True` threads are killed when the main program exits; non-daemon threads keep the process alive until they finish.

## Races and locks

```pycon
>>> counter = 0
>>> def unsafe_increment(n):
...     global counter
...     for _ in range(n):
...         counter += 1                       # read, add, write: not atomic
...
>>> lock = threading.Lock()
>>> safe_counter = 0
>>> def safe_increment(n):
...     global safe_counter
...     for _ in range(n):
...         with lock:
...             safe_counter += 1
...
>>> ts = [threading.Thread(target=safe_increment, args=(10000,)) for _ in range(4)]
>>> for t in ts: t.start()
>>> for t in ts: t.join()
>>> safe_counter
40000
```

Without the lock, the unsafe version can lose updates when threads interleave between the read and the write (whether it does in a given run depends on timing, which is what makes races dangerous). Any shared mutable state touched by more than one thread needs a lock, or should be avoided by giving each thread its own data and combining results at the end.

Lock types: `Lock` (basic), `RLock` (re-entrant by the same thread), `Semaphore` (allow N holders; limits concurrency), `Event` (one thread signals others), `Condition` (wait for a predicate). Keep locked sections short and never call out to unknown code while holding a lock. **Deadlock** happens when two threads each wait for a lock the other holds; avoid by acquiring locks in a fixed global order or using a single lock.

## Thread-safe communication: `queue.Queue`

Instead of sharing variables, pass messages. `queue.Queue` is thread-safe and supports the producer/consumer pattern, which is the safe way to structure most threaded programs.

```pycon
>>> import queue
>>> q = queue.Queue()
>>> processed = []
>>> def worker():
...     while True:
...         item = q.get()
...         if item is None:                   # sentinel: stop
...             break
...         processed.append(item * 2)
...         q.task_done()
...
>>> workers = [threading.Thread(target=worker) for _ in range(3)]
>>> for w in workers: w.start()
>>> for i in range(9): q.put(i)
>>> for _ in workers: q.put(None)
>>> for w in workers: w.join()
>>> sorted(processed)
[0, 2, 4, 6, 8, 10, 12, 14, 16]
```

## `concurrent.futures`: the API to use

A pool of workers, `submit`/`map`, and `Future` objects. The same interface for threads and processes, so switching is one line.

```pycon
>>> from concurrent.futures import ThreadPoolExecutor, as_completed
>>> def square_after_wait(n):
...     time.sleep(0.01)
...     return n * n
...
>>> with ThreadPoolExecutor(max_workers=4) as pool:
...     squares = list(pool.map(square_after_wait, range(5)))          # results in input order
...
>>> squares
[0, 1, 4, 9, 16]
>>> with ThreadPoolExecutor(max_workers=4) as pool:
...     futures = {pool.submit(square_after_wait, n): n for n in range(5)}
...     done = sorted(futures[f] for f in as_completed(futures))       # as they finish
...
>>> done
[0, 1, 2, 3, 4]
```

`Future.result()` blocks until done and re-raises any exception from the worker. `as_completed` yields futures in completion order; `pool.map` keeps input order and re-raises the first exception when you iterate.

## Processes

`multiprocessing` starts separate interpreters, each with its own GIL, so CPU-bound work runs in parallel on several cores.

```python
from concurrent.futures import ProcessPoolExecutor

def count_primes(limit):
    count = 0
    for n in range(2, limit):
        if all(n % d for d in range(2, int(n ** 0.5) + 1)):
            count += 1
    return count

if __name__ == "__main__":                        # required on Windows/macOS (spawn start method)
    with ProcessPoolExecutor() as pool:
        totals = list(pool.map(count_primes, [200_000] * 4))
    print(sum(totals))
```

Rules that trip people up:

- The `if __name__ == "__main__":` guard is mandatory on platforms that spawn processes by importing the main module; without it, each child re-runs the pool creation and the program forks endlessly or errors.
- Functions and arguments must be **picklable**: top-level functions yes; lambdas, nested functions, and open sockets no.
- Memory is not shared. Results come back by pickling. Large arrays should use shared memory (`multiprocessing.shared_memory`) or be processed in chunks.
- Process startup costs tens of milliseconds; batch small tasks.

`multiprocessing.Pool` is the older API with the same idea (`pool.map`, `pool.apply_async`).

## Choosing, quickly

```
Is it waiting (network, disk, sleep)?
    yes → ThreadPoolExecutor (simple) or asyncio (very many connections)
    no  → is the heavy work in Python code?
              yes → ProcessPoolExecutor
              no (NumPy, C library that releases the GIL) → threads are fine
```

And always the first answer: measure. `time.perf_counter()` around the suspect section, or `cProfile` (performance chapter). Many "make it faster" problems are solved by a better algorithm or by caching before any concurrency.

## Thread safety of built-ins

Individual operations on built-in containers (`list.append`, `dict[k] = v`) are atomic in CPython because they run under the GIL in one bytecode's worth of C code. Compound operations (`check then set`, `+= 1`, iterate while another thread mutates) are not. When in doubt, lock.

## Common mistakes

- Using threads for CPU-bound Python and being surprised it is not faster.
- Sharing state between threads without locks "because the GIL protects it".
- Forgetting the main guard with multiprocessing.
- Passing a lambda or a method of a large object to a process pool.
- Creating a new thread or process per tiny task instead of using a pool.
- Calling `join()` on threads before starting all of them, which serialises the work.
- Holding a lock while doing I/O.

## Interview questions

**What is the GIL?**
A mutex in CPython that allows only one thread to execute Python bytecode at a time. It simplifies memory management but prevents CPU-bound threads from running in parallel. It is released during I/O and in many C extensions.

**Are Python threads useless then?**
No. They overlap I/O waits well and are the simplest way to run many network or disk operations concurrently. They just do not parallelise CPU-bound Python code.

**How do you achieve true parallelism in Python?**
With processes (`multiprocessing`, `ProcessPoolExecutor`), each with its own interpreter and GIL, or with native libraries that release the GIL, or with the experimental free-threaded build.

**What is the difference between concurrency and parallelism?**
Concurrency is dealing with several tasks in overlapping time periods (interleaving); parallelism is executing them at the same instant on several cores. Threads in CPython give concurrency; processes give parallelism.

**What is a race condition and how do you prevent it?**
When the result depends on the timing of threads accessing shared state, such as two threads incrementing a counter. Prevent with locks around the critical section, with thread-safe queues, or by not sharing mutable state.

**What is a deadlock?**
Two or more threads each waiting for a lock the other holds, forever. Avoid by acquiring locks in a consistent order, using timeouts, or holding one lock at a time.

**What is `concurrent.futures`?**
A high-level API with `ThreadPoolExecutor` and `ProcessPoolExecutor` sharing one interface (`submit`, `map`, futures), which makes switching between threads and processes trivial.

**When would you use `multiprocessing` over threads?**
For CPU-bound work in pure Python: parsing, computation, simulations. Not for I/O-bound work, where processes only add overhead.

**Why does multiprocessing need `if __name__ == "__main__"`?**
Because child processes (with the spawn start method) import the main module to get the target function; without the guard, the import re-executes the code that creates the pool, recursively.

**Is `list.append` thread-safe?**
Yes, as a single operation under the GIL. Compound sequences of operations are not.

**How would you download 1,000 URLs quickly?**
A `ThreadPoolExecutor` with a few dozen workers calling a blocking HTTP client, or `asyncio` with an async client if the count is much larger. The work is I/O-bound, so the GIL is not a limit.

**What is a daemon thread?**
A thread that does not keep the program alive; when only daemon threads remain, the interpreter exits, killing them. Use for background housekeeping, never for work that must complete.
