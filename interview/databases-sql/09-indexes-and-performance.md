---
title: Indexes & Query Performance
part: Concepts
summary: What an index is and costs, when the database uses one and when it cannot, composite and covering indexes, reading EXPLAIN, and the handful of query patterns that make things slow.
---

## What an index is

A separate, sorted structure (almost always a **B-tree**) holding the indexed column values and pointers to the rows. Finding a value in it is O(log n) instead of scanning the whole table. The primary key gets one automatically; every other index you create yourself.

```
Without index:  scan every row of orders, check customer_id = 4          (full table scan)
With index:     walk the B-tree on customer_id to 4, follow pointers      (index seek)
```

The cost: every `INSERT`, `UPDATE` of the column, and `DELETE` must also update each index, and indexes take space. So you index the columns you search, join, and sort on, not every column.

```sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_date_status ON orders (order_date, status);
CREATE UNIQUE INDEX idx_customers_name ON customers (name);
```

## When an index is used

The optimiser uses an index when the query filters or joins on the indexed column with a condition it can seek: equality, range, `IN`, prefix `LIKE 'abc%'`, `IS NULL` (usually), and when the index's sort order matches `ORDER BY`. It does **not** help when:

- the column is wrapped in a function: `WHERE YEAR(order_date) = 2026` or `LOWER(email) = ...` (use a range, or a function-based index);
- the pattern starts with a wildcard: `LIKE '%abc'`;
- the types are mismatched and the column must be converted: comparing a varchar column to an integer;
- the query returns a large fraction of the table: reading most rows through an index is slower than a scan, so the optimiser chooses the scan;
- the leading column of a composite index is not in the condition (next section).

Rewrite the function case as a **sargable** condition (search-argument-able):

```sql
-- no-run
-- not sargable: the function hides the column from the index
WHERE YEAR(order_date) = 2026
-- sargable: a range on the raw column
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'
```

## Composite indexes and the leftmost rule

An index on `(a, b, c)` is sorted by `a`, then `b` within `a`, then `c`. It serves conditions on `a`, on `a, b`, and on `a, b, c`, and range queries on the last used column. It does not serve a condition on `b` alone, because `b` is not sorted globally. Put the most selective equality column first, then the range or sort column.

| Query | Index `(customer_id, order_date)` |
|---|---|
| `WHERE customer_id = 4` | used |
| `WHERE customer_id = 4 AND order_date > '2026-03-01'` | used, both columns |
| `WHERE customer_id = 4 ORDER BY order_date` | used, no sort needed |
| `WHERE order_date > '2026-03-01'` | not used (not the leading column) |

A **covering index** contains every column the query needs (`INCLUDE` columns in PostgreSQL/SQL Server, or just add them), so the database answers from the index without touching the table. `SELECT customer_id, order_date FROM orders WHERE customer_id = 4` is fully covered by the index above.

## Reading EXPLAIN

`EXPLAIN` (and `EXPLAIN ANALYZE` to actually run it) shows the plan. What to look for:

- **Seq Scan / Full Table Scan / ALL** on a large table where you expected a seek: a missing or unusable index.
- **Index Scan / Index Seek / ref** on the right index: good.
- **Nested Loop** with a scan on the inner side: the join column needs an index.
- **Hash Join** / **Merge Join**: normal for large joins.
- **Sort** with a large row count: consider an index matching `ORDER BY`.
- **Rows estimated versus actual** (with ANALYZE): a large gap means stale statistics (`ANALYZE` the table).

A PostgreSQL example, illustrative:

```text
Index Scan using idx_orders_customer on orders  (cost=0.15..8.17 rows=1 width=24)
  Index Cond: (customer_id = 4)
```

versus the same query without the index:

```text
Seq Scan on orders  (cost=0.00..25.88 rows=6 width=24)
  Filter: (customer_id = 4)
```

In SQLite the equivalent is `EXPLAIN QUERY PLAN`:

```sql
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 4;
```

which reports `SEARCH orders USING INDEX idx_orders_customer (customer_id=?)` with the index and `SCAN orders` without it.

## The patterns that make queries slow

1. **Missing index on a join or filter column.** The most common cause; the fix is one `CREATE INDEX`.
2. **Functions on indexed columns** in `WHERE` (see above).
3. **`SELECT *`** on wide tables when a few columns are needed: more I/O, no covering index.
4. **N+1 queries** from application code: one query for a list, then one query per item. Fix with a join or `WHERE id IN (...)`.
5. **Row multiplication from joins** followed by `DISTINCT` to clean up: fix the join, aggregate first.
6. **`OFFSET` pagination** deep into a result: the database still reads and discards the skipped rows. Use keyset pagination: `WHERE (order_date, id) < (:last_date, :last_id) ORDER BY order_date DESC, id DESC LIMIT 20`.
7. **Correlated subqueries** the optimiser could not flatten: rewrite as a join or window.
8. **Implicit type conversion** disabling the index.
9. **Too many indexes** on a write-heavy table.
10. **Stale statistics** causing bad plans: run `ANALYZE`.
11. **Lock contention** from long transactions (next chapter).

## Other performance tools, one line each

- **Caching** at the application layer for hot, slow-changing results.
- **Denormalisation** or materialised views for expensive aggregates read often.
- **Partitioning** large tables by date or key so queries touch one partition.
- **Read replicas** for scaling reads; **sharding** for scaling writes (the System Design book covers both).
- **Connection pooling** so each request does not open a new connection.
- **Batching** writes (multi-row `INSERT`) instead of one statement per row.

## Clustered versus non-clustered

A **clustered index** determines the physical order of the table rows (SQL Server and MySQL InnoDB store the table in primary-key order; one per table). A **non-clustered** (secondary) index is a separate structure pointing at rows. Range scans on the clustered key are fast because the rows are adjacent; secondary index lookups may need an extra hop to the row.

## Interview questions

**What is an index and how does it work?**
A sorted B-tree over one or more columns with pointers to rows, so lookups are logarithmic instead of a full scan. Writes must maintain it, so it costs write speed and space.

**When would an index not be used?**
A function or cast on the column, a leading wildcard `LIKE`, a condition not on the leading column of a composite index, low selectivity where a scan is cheaper, or stale statistics.

**What is a composite index and does column order matter?**
An index on several columns; yes. It serves queries that use a prefix of its columns in order (leftmost rule). Put equality columns first, then range or sort columns.

**What is a covering index?**
One that includes every column a query needs, so the table is never read. Faster reads, larger index.

**Clustered versus non-clustered index?**
Clustered defines the row storage order (one per table); non-clustered is a separate structure with pointers. Primary keys are usually clustered in MySQL InnoDB and SQL Server.

**How would you find out why a query is slow?**
`EXPLAIN ANALYZE` it: look for sequential scans on large tables, missing indexes on join and filter columns, large sorts, and estimate versus actual row mismatches. Then add or fix the index or rewrite the condition.

**What is the N+1 problem?**
Running one query for a list and then one more per item. Replace with a join or a single `IN` query, or use the ORM's eager loading.

**Why is `OFFSET 100000` slow?**
The database must produce and discard the first 100,000 rows. Keyset (cursor) pagination seeks directly to the last seen key.

**Does adding indexes always help?**
No. Each index slows writes and uses space, and unused ones are pure cost. Index what queries actually use, and check with the plan.

**What is a sargable query?**
One whose conditions let the optimiser use an index: comparisons on bare columns, ranges, prefix matches. Wrapping the column in a function makes it non-sargable.
