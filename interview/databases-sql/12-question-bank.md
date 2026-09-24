---
title: Rapid-Fire Question Bank
part: Interview Prep
summary: Sixty short questions with two-sentence answers, covering everything in this book, for the night before the interview.
---

## SQL basics

**1. What is SQL?** The standard language for defining, querying, and modifying relational data: DDL (`CREATE`, `ALTER`), DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), DCL (`GRANT`), TCL (`COMMIT`, `ROLLBACK`).

**2. Order of clause evaluation?** FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.

**3. `WHERE` versus `HAVING`?** Rows before grouping versus groups after aggregation.

**4. `DISTINCT` versus `GROUP BY`?** Both remove duplicate combinations; `GROUP BY` also lets you aggregate per group.

**5. `UNION` versus `UNION ALL`?** `UNION` removes duplicates (and sorts to do so, slower); `UNION ALL` keeps everything. Use `UNION ALL` unless duplicates must go.

**6. `IN` versus `EXISTS`?** Membership in a list versus existence of a matching row; `EXISTS` short-circuits and is NULL-safe; `NOT EXISTS` over `NOT IN`.

**7. What is NULL?** Unknown. Comparisons with it are unknown; test with `IS NULL`; aggregates skip it; `COALESCE` defaults it.

**8. `COUNT(*)` versus `COUNT(col)`?** All rows versus non-null values of the column.

**9. How do you sort NULLs last?** `ORDER BY col NULLS LAST` (PostgreSQL, Oracle) or `ORDER BY col IS NULL, col` (MySQL, SQLite).

**10. What does `LIKE '_a%'` match?** Any value whose second character is `a`.

**11. `BETWEEN` inclusive?** Yes, both ends.

**12. What is `CASE` for?** Inline conditional expressions, including inside aggregates for pivots.

**13. What is an alias?** A temporary name for a column or table (`AS`), usable in `ORDER BY` but not `WHERE`.

**14. `CHAR` versus `VARCHAR`?** Fixed-length padded versus variable-length.

**15. `DELETE` versus `TRUNCATE` versus `DROP`?** Rows by condition (logged) versus all rows fast (minimal log) versus the table itself.

## Joins and subqueries

**16. Inner versus outer join?** Matching rows only versus all rows from one or both sides with NULLs for no match.

**17. Left join with a `WHERE` on the right table?** Becomes an inner join; put the condition in `ON`.

**18. Self join?** A table joined to itself via aliases, for hierarchies and row-to-row comparisons.

**19. Cross join?** Cartesian product; every row with every row.

**20. Rows in A not in B?** `LEFT JOIN ... WHERE b.key IS NULL` or `NOT EXISTS`.

**21. Why did my sums double?** One-to-many join duplicated rows; aggregate the many side first.

**22. Correlated subquery?** A subquery referencing the outer row, evaluated per row.

**23. CTE?** `WITH name AS (...)`: a named, single-statement temporary result; readable multi-step queries; recursion.

**24. Recursive CTE use?** Trees and hierarchies of unknown depth (org chart, categories).

**25. Derived table?** A subquery in `FROM` with an alias.

## Aggregation and windows

**26. Aggregate functions?** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`; they collapse rows and skip NULLs.

**27. Non-aggregated column not in `GROUP BY`?** Error in standard SQL; arbitrary value in lax MySQL. Always group or aggregate.

**28. Window function?** An aggregate or ranking computed per row over a partition without collapsing rows: `f() OVER (PARTITION BY ... ORDER BY ...)`.

**29. `ROW_NUMBER` versus `RANK` versus `DENSE_RANK`?** Unique sequence; ties share rank with gaps; ties share rank without gaps.

**30. Second highest salary?** `DENSE_RANK() = 2` in a subquery, or `MAX(salary) WHERE salary < (SELECT MAX(salary))`.

**31. Top N per group?** Rank with `PARTITION BY group ORDER BY value DESC` in a CTE, filter `rnk <= N`.

**32. Running total?** `SUM(x) OVER (ORDER BY date)`.

**33. Previous row's value?** `LAG(col) OVER (ORDER BY ...)`.

**34. Can you filter on a window function in `WHERE`?** No; wrap in a CTE or subquery.

**35. Median in SQL?** `PERCENTILE_CONT(0.5)` where available; otherwise number rows from both ends and average the middle.

**36. Pivot rows to columns?** `SUM(CASE WHEN ... THEN ... END)` per column.

**37. Delete duplicates keeping one?** `ROW_NUMBER` partitioned by the duplicated columns, delete `rn > 1`; or keep `MIN(id)` per group.

## Indexes and performance

**38. What is an index?** A B-tree over columns with row pointers: logarithmic lookups, extra cost on writes.

**39. When is an index ignored?** Function on the column, leading wildcard, non-leading composite column, low selectivity, type mismatch.

**40. Composite index rule?** Leftmost prefix: `(a, b)` serves `a` and `a, b`, not `b` alone.

**41. Covering index?** Contains all columns the query needs; no table access.

**42. Clustered index?** Defines physical row order; one per table.

**43. How do you diagnose a slow query?** `EXPLAIN ANALYZE`; look for scans on big tables, missing join indexes, big sorts, bad estimates.

**44. N+1 problem?** One query per item after a list query; fix with a join or `IN`.

**45. Why avoid `SELECT *`?** More I/O, breaks covering indexes, fragile when columns change.

**46. Deep `OFFSET` slow?** Skipped rows are still read; use keyset pagination.

**47. Sargable?** A condition that can use an index: bare column compared to a value or range.

## Transactions and design

**48. ACID?** Atomicity, Consistency, Isolation, Durability.

**49. Isolation levels?** Read uncommitted, read committed, repeatable read, serializable.

**50. Dirty, non-repeatable, phantom?** Uncommitted data; changed row on re-read; new rows on re-query.

**51. Deadlock?** Mutual lock wait; database aborts one; avoid with consistent lock order and short transactions.

**52. Optimistic versus pessimistic locking?** Version check at write versus lock before read.

**53. MVCC?** Row versions give readers snapshots without blocking writers.

**54. Normalization?** Store each fact once; 1NF atomic, 2NF whole key, 3NF nothing but the key.

**55. Denormalization?** Deliberate duplication for read speed; keep the source of truth normalised.

**56. Primary versus foreign versus unique key?** Row identity (one, not null); reference to another key; uniqueness (several allowed, NULLs usually allowed).

**57. Many-to-many?** Junction table with two foreign keys.

**58. Money type?** `DECIMAL`, never float.

**59. SQL versus NoSQL?** Relational with joins and ACID versus flexible, horizontally scaled stores with simpler access patterns; default relational, deviate with a reason.

**60. View versus materialised view?** A saved query computed on read versus a stored result refreshed on demand.

## The five queries to be able to write cold

1. Nth highest salary with `DENSE_RANK`.
2. Top earner per department with `ROW_NUMBER` in a CTE.
3. Customers with no orders with `NOT EXISTS`.
4. Monthly totals with month-over-month change using `LAG`.
5. Duplicates with `GROUP BY ... HAVING COUNT(*) > 1`, and the delete that keeps one.

If you can write those five from memory, explain `WHERE` versus `HAVING`, inner versus left join, an index and when it is not used, and ACID with isolation levels, you are ready for the database part of almost any software interview.
