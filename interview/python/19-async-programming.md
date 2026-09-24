---
title: Async Programming
part: Advanced
summary: The event loop model, coroutines with async and await, running tasks concurrently with gather, timeouts and cancellation, async iterators and context managers, and when async is and is not the right tool.
---

## The idea

Async is concurrency on a single thread. A coroutine runs until it reaches an operation that would wait (a network read, a sleep), then **yields control** to the event loop, which runs another coroutine meanwhile. When the wait is over, the loop resumes the first one. Nothing runs in parallel; things overlap while waiting.

Compared with threads: no locks needed for most shared state (only one coroutine runs at a time and switches only at `await`), far cheaper per task (tens of thousands of concurrent connections are routine), and explicit switch points make behaviour predictable. The cost: every I/O call in the chain must be async-aware, and a blocking call anywhere freezes everything.

## Coroutines, `async`, `await`

```pycon
>>> import asyncio, time
>>> async def fetch(name, delay):
...     await asyncio.sleep(delay)          # yields to the event loop while "waiting"
...     return f"{name} done"
...
>>> fetch("a", 0.01)
<coroutine object fetch at 0x...>
>>> asyncio.run(fetch("a", 0.01))
'a done'
```

Calling an `async def` function does not run it; it returns a **coroutine object** (and Python warns "coroutine was never awaited" if it is discarded, as the REPL line above does). Something must schedule it: `asyncio.run()` at the top level, or `await` inside another coroutine. Forgetting the `await` is the most common async bug (the coroutine never runs and Python warns "coroutine was never awaited").

`await` can only appear inside `async def`, and can only be applied to awaitables: coroutines, tasks, futures, and objects with `__await__`.

## Running things concurrently

`await` one after another is sequential. To overlap, schedule them together with `gather` (or create tasks).

```pycon
>>> async def sequential():
...     await fetch("a", 0.05)
...     await fetch("b", 0.05)
...     await fetch("c", 0.05)
...
>>> async def concurrent():
...     return await asyncio.gather(fetch("a", 0.05), fetch("b", 0.05), fetch("c", 0.05))
...
>>> async def timed(coro):
...     start = time.perf_counter()
...     result = await coro
...     return result, time.perf_counter() - start
...
>>> _, elapsed = asyncio.run(timed(sequential()))
>>> elapsed >= 0.14                      # three waits, one after another
True
>>> results, elapsed = asyncio.run(timed(concurrent()))
>>> results, elapsed < 0.12              # three waits, overlapped: about 0.05 s in total
(['a done', 'b done', 'c done'], True)
```

Three 50 ms waits completed in about 50 ms. `gather` returns results in the order of its arguments, regardless of completion order. Note that `gather` must be called from inside a running coroutine (or given tasks); calling it at the top level with no event loop raises `RuntimeError`.

### Tasks

`asyncio.create_task(coro)` schedules a coroutine to run in the background immediately and returns a `Task` you can await later, cancel, or check. `gather` creates tasks for you. Python 3.11 adds `TaskGroup`, which cancels the siblings if one fails:

```python
async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("a", 0.1))
        t2 = tg.create_task(fetch("b", 0.1))
    # both finished (or an exception group is raised)
    return t1.result(), t2.result()
```

## Timeouts and cancellation

```pycon
>>> async def slow():
...     await asyncio.sleep(10)
...
>>> async def with_timeout():
...     try:
...         await asyncio.wait_for(slow(), timeout=0.05)
...     except asyncio.TimeoutError:
...         return "timed out"
...
>>> asyncio.run(with_timeout())
'timed out'
```

Cancellation raises `CancelledError` inside the coroutine at its current `await`; `try`/`finally` blocks run, so cleanup happens. `asyncio.timeout()` (3.11) is the context-manager form. Handling `CancelledError` and not re-raising it is a bug in almost every case.

## Async iteration and context managers

```pycon
>>> async def ticker(n):
...     for i in range(n):
...         await asyncio.sleep(0)
...         yield i                          # an async generator
...
>>> async def consume():
...     return [i async for i in ticker(3)]  # async comprehension
...
>>> asyncio.run(consume())
[0, 1, 2]
>>> from contextlib import asynccontextmanager
>>> @asynccontextmanager
... async def connection():
...     await asyncio.sleep(0)               # pretend to connect
...     try:
...         yield "conn"
...     finally:
...         await asyncio.sleep(0)           # pretend to close
...
>>> async def use():
...     async with connection() as c:
...         return c
...
>>> asyncio.run(use())
'conn'
```

`async for` uses `__aiter__`/`__anext__`; `async with` uses `__aenter__`/`__aexit__`. Database drivers, HTTP clients, and websockets expose these.

## Synchronisation and communication

Because switches only happen at `await`, plain reads and writes between awaits are safe. You still need `asyncio.Lock` when a critical section itself contains an `await` (for example, check a cache, then await a fetch, then write the cache), `asyncio.Semaphore` to limit concurrency (do not open 10,000 connections at once), and `asyncio.Queue` for producer/consumer pipelines.

```pycon
>>> async def limited_fetch(sem, name):
...     async with sem:                     # at most 2 inside at a time
...         await asyncio.sleep(0.01)
...         return name
...
>>> async def run_all():
...     sem = asyncio.Semaphore(2)
...     return await asyncio.gather(*(limited_fetch(sem, i) for i in range(5)))
...
>>> asyncio.run(run_all())
[0, 1, 2, 3, 4]
```

## Blocking calls: the cardinal sin

A regular blocking call (`time.sleep`, `requests.get`, a CPU-heavy loop) inside a coroutine blocks the whole event loop; every other task stalls. Options:

- Use an async library (`aiohttp`/`httpx` instead of `requests`, `asyncio.sleep` instead of `time.sleep`, async database drivers).
- Push blocking work to a thread: `await asyncio.to_thread(blocking_function, *args)` (3.9+), or `loop.run_in_executor`.
- Push CPU-heavy work to a process pool via `run_in_executor(ProcessPoolExecutor(), ...)`.

```pycon
>>> def blocking_work(x):
...     time.sleep(0.02)
...     return x * 2
...
>>> async def offload():
...     return await asyncio.gather(*(asyncio.to_thread(blocking_work, i) for i in range(3)))
...
>>> asyncio.run(offload())
[0, 2, 4]
```

## How it works underneath

Coroutines are built on generators: `await` suspends the coroutine the way `yield` suspends a generator, handing control back to the event loop. The loop keeps a queue of ready callbacks and uses the operating system's I/O multiplexing (`select`/`epoll`/`kqueue`) to learn when sockets are readable or writable, then resumes the coroutines waiting on them. There is one event loop per thread; `asyncio.run` creates it, runs the main coroutine, and closes it.

Knowing this lets you answer "why can't I call `asyncio.run` from inside a running loop" (the thread already has one; use `await` or `create_task`) and "why does a CPU loop freeze everything" (nothing yields to the loop).

## When to use async

- Servers and clients handling **many simultaneous connections**: web servers (FastAPI, aiohttp), websockets, scrapers, chat services.
- Workflows that are **mostly waiting** on many independent I/O operations.

When not to:

- CPU-bound work (use processes).
- A handful of I/O calls where a thread pool is simpler and the libraries are synchronous.
- Codebases where the surrounding stack is synchronous; mixing is painful.

## Common mistakes

- Forgetting `await` (coroutine never runs).
- Awaiting coroutines one by one and expecting concurrency; use `gather` or tasks.
- Calling blocking functions inside coroutines.
- Creating a task and dropping the reference, so it can be garbage collected mid-flight; keep references (or use `TaskGroup`).
- Swallowing `CancelledError`.
- Unbounded concurrency with `gather` over thousands of items; use a semaphore or a queue with workers.

## Interview questions

**What is `asyncio` and how does it differ from threads?**
A single-threaded, cooperative concurrency framework built on an event loop and coroutines. Tasks switch only at `await`, so there is no preemption, fewer locks, and much lower per-task overhead than threads. It helps only I/O-bound work.

**What does `await` do?**
Suspends the current coroutine until the awaited operation completes, letting the event loop run other tasks in the meantime. It also unwraps the result.

**What is the difference between a coroutine and a task?**
A coroutine object is a suspended function that runs only when awaited. A task wraps a coroutine and schedules it on the loop immediately, running concurrently with other tasks; you await the task to get its result.

**How do you run several coroutines concurrently?**
`asyncio.gather(c1, c2, ...)`, or create tasks with `create_task`/`TaskGroup` and await them.

**What happens if you call a blocking function inside a coroutine?**
The event loop is blocked; no other task runs until it returns. Use an async equivalent or `asyncio.to_thread`.

**Does async make CPU-bound code faster?**
No. There is still one thread and the GIL. Use processes.

**What is the event loop?**
The scheduler that runs ready coroutines, waits for I/O readiness from the OS, and resumes the coroutines whose I/O is ready. One per thread; `asyncio.run` manages it.

**How do you limit concurrency in async code?**
`asyncio.Semaphore(n)` around the operation, or a fixed number of worker tasks consuming an `asyncio.Queue`.

**What is an async generator?**
An `async def` function containing `yield`; consumed with `async for`. Used for streams of items that arrive over time.

**When would you choose threads over asyncio?**
When the I/O libraries are synchronous, the number of concurrent operations is modest, or the codebase is synchronous and the cost of converting outweighs the benefit.

**How do timeouts work in asyncio?**
`asyncio.wait_for(coro, timeout)` or `async with asyncio.timeout(seconds)` cancels the inner operation and raises `TimeoutError` when the limit is exceeded.

**What does `asyncio.run` do?**
Creates a new event loop, runs the given coroutine to completion, cancels leftover tasks, and closes the loop. It is the entry point and must not be called from inside a running loop.
