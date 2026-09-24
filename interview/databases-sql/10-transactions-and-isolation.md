---
title: Transactions, ACID & Isolation
part: Concepts
summary: What a transaction guarantees, the four ACID properties in one sentence each, the isolation levels and the anomalies they allow, locking and deadlocks, and optimistic versus pessimistic control.
---

## Transactions

A transaction groups statements so that they either all take effect or none do. The money-transfer example is what interviewers expect:

```sql
BEGIN;
UPDATE employees SET salary = salary - 1000 WHERE id = 1;
UPDATE employees SET salary = salary + 1000 WHERE id = 2;
COMMIT;
```

```sql
SELECT id, name, salary FROM employees WHERE id IN (1, 2) ORDER BY id;
```

```text
id | name | salary
---+------+-------
1  | Ava  | 8000
2  | Ben  | 8000
(2 rows)
```

If anything fails between `BEGIN` and `COMMIT`, or you issue `ROLLBACK`, both updates are undone.

```sql
BEGIN;
UPDATE employees SET salary = 0 WHERE id = 1;
ROLLBACK;
```

```sql
SELECT id, name, salary FROM employees WHERE id = 1;
```

```text
id | name | salary
---+------+-------
1  | Ava  | 8000
(1 row)
```

Statements outside an explicit transaction run in **autocommit** mode: each statement is its own transaction. `SAVEPOINT name` / `ROLLBACK TO name` undo part of a transaction.

## ACID

| Property | Meaning | How the database provides it |
|---|---|---|
| **Atomicity** | All or nothing | Undo log / rollback |
| **Consistency** | Constraints hold before and after | Constraint checks; the application keeps business rules |
| **Isolation** | Concurrent transactions do not see each other's half-done work | Locks or multi-version concurrency control (MVCC) |
| **Durability** | Committed data survives crashes | Write-ahead log flushed to disk before commit |

Say all four with the one-line meaning; then be ready to go deep on isolation, which is where the real questions are.

## The anomalies

What can go wrong when two transactions run at once:

- **Dirty read**: reading another transaction's uncommitted change, which may then be rolled back.
- **Non-repeatable read**: reading a row twice in one transaction and getting different values because another transaction committed an update in between.
- **Phantom read**: running the same range query twice and getting new rows because another transaction inserted them.
- **Lost update**: two transactions read a value, both compute a new one, both write; one update overwrites the other.
- **Write skew**: two transactions each check a condition and write based on it, and together they violate the condition (two doctors both going off call because each saw the other was on).

## Isolation levels

The SQL standard defines four levels by which anomalies they prevent:

| Level | Dirty read | Non-repeatable read | Phantom | Typical default |
|---|---|---|---|---|
| Read uncommitted | possible | possible | possible | |
| Read committed | prevented | possible | possible | PostgreSQL, Oracle, SQL Server |
| Repeatable read | prevented | prevented | possible in the standard (prevented in PostgreSQL and InnoDB for reads) | MySQL InnoDB |
| Serializable | prevented | prevented | prevented | |

Higher levels give more correctness and less concurrency (more waiting or more aborted transactions). **Read committed** is the usual default and is fine for most work; **serializable** is for money and inventory. Set it per transaction: `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;` (or `BEGIN ISOLATION LEVEL ...` in PostgreSQL).

**MVCC** (multi-version concurrency control), used by PostgreSQL, MySQL InnoDB, and Oracle, keeps old row versions so readers see a consistent snapshot without blocking writers, and writers do not block readers. Locks are still taken for writes.

## Locks and deadlocks

Writes take row locks until commit. Two transactions updating the same row wait for each other in sequence. A **deadlock** is two transactions each waiting for a lock the other holds: A locks row 1 then wants row 2; B locks row 2 then wants row 1. The database detects it and aborts one (the application must retry).

Avoiding deadlocks: touch rows in a consistent order (by primary key), keep transactions short, do not hold a transaction open while waiting on the user or the network, and use `SELECT ... FOR UPDATE` to lock rows up front when you know you will update them.

```sql
-- no-run
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;   -- lock the row now
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

## Optimistic versus pessimistic concurrency

- **Pessimistic**: lock first (`FOR UPDATE`), then read and write. Safe, can block, suits high contention.
- **Optimistic**: read a version number, do the work, and write with `WHERE version = :seen`; if zero rows update, someone else changed it and you retry. No locks held while the user thinks; suits low contention and web apps.

```sql
-- no-run
UPDATE products SET price = 350, version = version + 1
WHERE id = 2 AND version = 7;     -- succeeds only if nobody changed it since we read version 7
```

Avoiding the lost update is the point of both.

## Durability details, briefly

Commit is acknowledged after the write-ahead log is flushed to disk; the table files are updated later. Replication adds copies on other machines; a synchronous replica means a commit also survives losing the primary (System Design book).

## Interview questions

**What is a transaction?**
A unit of work whose statements all commit or all roll back, executed with atomicity, consistency, isolation, and durability guarantees.

**Explain ACID.**
Atomicity: all or nothing. Consistency: constraints hold. Isolation: concurrent transactions behave as if sequential to the chosen degree. Durability: committed work survives crashes.

**What are the isolation levels?**
Read uncommitted, read committed, repeatable read, serializable, each preventing more anomalies (dirty, non-repeatable, phantom reads) at the cost of concurrency.

**What is a dirty read? A phantom read?**
Reading uncommitted data from another transaction; seeing new rows in a repeated range query because another transaction inserted them.

**What is the default isolation level?**
Read committed in PostgreSQL, Oracle, and SQL Server; repeatable read in MySQL InnoDB.

**What is a deadlock and how do you avoid it?**
Two transactions waiting on each other's locks forever; the database aborts one. Avoid by locking in a consistent order, keeping transactions short, and locking up front with `FOR UPDATE`.

**Optimistic versus pessimistic locking?**
Optimistic checks a version at write time and retries on conflict, holding no locks; pessimistic locks rows before working. Choose by contention level.

**What is MVCC?**
Keeping multiple versions of rows so readers see a consistent snapshot without blocking writers. Used by PostgreSQL, InnoDB, and Oracle.

**How does the database make commits durable?**
By writing the change to a write-ahead log and flushing it to disk before acknowledging the commit; the data files are updated afterwards and recovered from the log after a crash.

**What is a lost update and how do you prevent it?**
Two concurrent read-modify-write cycles where one overwrites the other. Prevent with `SELECT ... FOR UPDATE`, atomic updates (`SET x = x + 1`), or optimistic version checks.
