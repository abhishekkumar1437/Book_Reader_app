---
title: Subqueries & CTEs
part: Queries
summary: Scalar, IN, EXISTS, and correlated subqueries, derived tables, WITH for readable multi-step queries, and a recursive CTE for hierarchies. When to use which.
---

## Subqueries in one sentence each

- **Scalar**: returns one value; usable anywhere a value is.
- **List** (`IN`, `NOT IN`): returns one column; usable in membership tests.
- **Existence** (`EXISTS`): returns whether any row matches; the fastest way to ask "is there one".
- **Derived table**: a subquery in `FROM` with an alias; usable like a table.
- **Correlated**: refers to the outer query's row; runs once per outer row (logically).

## Scalar subquery

```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

```text
name | salary
-----+-------
Ava  | 9000
Finn | 8000
Ben  | 7000
Cara | 7000
(4 rows)
```

"Above average" questions are always this shape. A scalar subquery must return exactly one row and column or the query errors.

## IN and EXISTS

```sql
SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE status = 'shipped')
ORDER BY name;
```

```text
name
----
Acme
Bolt
(2 rows)
```

```sql
SELECT c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'shipped')
ORDER BY c.name;
```

```text
name
----
Acme
Bolt
(2 rows)
```

They return the same rows. `EXISTS` stops at the first match and is unaffected by NULLs in the subquery; `IN` is fine for small lists and readable. The negative forms differ: `NOT EXISTS` is safe, `NOT IN` returns nothing if the list contains a NULL (joins chapter).

## Correlated subquery

The inner query uses a column from the outer row. Read it as "for each row, compute this".

```sql
SELECT e.name, e.salary, e.dept_id
FROM employees e
WHERE e.salary = (SELECT MAX(salary) FROM employees x WHERE x.dept_id = e.dept_id)
ORDER BY e.dept_id;
```

```text
name | salary | dept_id
-----+--------+--------
Ava  | 9000   | 1
Finn | 8000   | 2
Gia  | 4500   | 3
(3 rows)
```

Correlated subqueries are clear but can be slow on large tables (conceptually one scan per outer row); the optimiser usually rewrites them as joins, and a window function expresses the same idea more efficiently.

## Derived tables

A subquery in `FROM`. Use it to aggregate first and join second (the fix for multiplied totals).

```sql
SELECT c.name, t.total
FROM customers c
JOIN (SELECT customer_id, SUM(amount) AS total
      FROM orders
      WHERE status = 'paid'
      GROUP BY customer_id) t ON t.customer_id = c.id
ORDER BY t.total DESC;
```

```text
name  | total
------+------
Acme  | 1700
Delta | 700
Bolt  | 300
(3 rows)
```

## Common table expressions

`WITH name AS (...)` defines a named result you can use like a table in the main query. Same power as a derived table, far more readable when there are several steps, and reusable more than once in the same statement.

```sql
WITH paid AS (
    SELECT customer_id, SUM(amount) AS total, COUNT(*) AS n
    FROM orders
    WHERE status = 'paid'
    GROUP BY customer_id
),
big AS (
    SELECT * FROM paid WHERE total >= 500
)
SELECT c.name, big.total, big.n
FROM big
JOIN customers c ON c.id = big.customer_id
ORDER BY big.total DESC;
```

```text
name  | total | n
------+-------+--
Acme  | 1700  | 2
Delta | 700   | 3
(2 rows)
```

Interviewers like CTEs because they show structured thinking: name each step after what it produces. Some engines materialise CTEs (PostgreSQL before 12 always did; now only when referenced more than once or asked to), so performance is usually identical to a derived table.

## Recursive CTE

For hierarchies of unknown depth: org charts, category trees, bill of materials. The CTE refers to itself; the anchor part seeds it, the recursive part extends it until no new rows appear.

```sql
WITH RECURSIVE chain AS (
    SELECT id, name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id IS NULL                      -- anchor: the top managers
    UNION ALL
    SELECT e.id, e.name, e.manager_id, c.level + 1
    FROM employees e
    JOIN chain c ON e.manager_id = c.id           -- recursive step: their reports
)
SELECT level, name, manager_id
FROM chain
ORDER BY level, name;
```

```text
level | name | manager_id
------+------+-----------
0     | Ava  | NULL
0     | Dev  | NULL
0     | Gia  | NULL
1     | Ben  | 1
1     | Cara | 1
1     | Esha | 4
1     | Finn | 4
1     | Hari | 1
(8 rows)
```

`RECURSIVE` is required in PostgreSQL and SQLite, optional in SQL Server and MySQL 8. Always have a condition that terminates (the join runs out of rows here); add a depth limit for safety on cyclic data.

## Subquery versus join versus CTE

| Need | Reach for |
|---|---|
| Compare each row to a single computed value | scalar subquery |
| Membership in another table's keys | `EXISTS` (or `IN` for small lists) |
| Rows with no match | `NOT EXISTS` or left join + `IS NULL` |
| Aggregate one side then combine | derived table or CTE, then join |
| Several dependent steps | CTEs, one per step |
| Hierarchy of unknown depth | recursive CTE |
| Per-row ranking or running values | window functions (next chapter) |

Everything a subquery can do, a join or a window function can usually do too. Pick whichever reads most clearly; performance differences are the optimiser's job unless the profile says otherwise.

## Interview questions

**What is a subquery?**
A query nested inside another, used as a value, a list, a condition, or a table.

**Correlated versus non-correlated?**
A correlated subquery references the outer query's columns and is evaluated per outer row; a non-correlated one is independent and evaluated once.

**`IN` versus `EXISTS`?**
Both test membership. `EXISTS` short-circuits on the first match and handles NULLs safely; `IN` is readable for small lists. For negation, `NOT EXISTS` is the safe choice.

**What is a CTE and why use one?**
A named temporary result defined with `WITH`, scoped to one statement. It makes multi-step queries readable, avoids repeating subqueries, and enables recursion.

**CTE versus temporary table?**
A CTE exists only for one statement and is not indexed; a temporary table persists for the session, can be indexed, and can be reused across statements.

**What is a recursive CTE?**
A CTE that references itself with an anchor and a recursive `UNION ALL` part, used to walk trees and graphs.

**Can a subquery return more than one column?**
Yes, in `FROM` (derived table), in `EXISTS`, and in row comparisons (`(a, b) IN (SELECT ...)` in PostgreSQL/MySQL). A scalar subquery must return one column and one row.

**How would you get employees earning above their department's average?**
Correlated subquery on `dept_id`, or a CTE computing the averages joined back, or `AVG(salary) OVER (PARTITION BY dept_id)` in a window.
