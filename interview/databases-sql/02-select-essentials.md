---
title: SELECT Essentials
part: Queries
summary: Filtering, sorting, limiting, DISTINCT, NULL rules, CASE, and the clause order SQL actually evaluates in. Short, because the hard parts are in the next chapters.
---

## The order of evaluation

You write clauses in this order, and the database evaluates them in a different one. Knowing the evaluation order explains most "why can't I use an alias here" and "why HAVING and not WHERE" questions.

```
Written:     SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
Evaluated:   FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

`WHERE` runs before the select list exists, so you cannot filter on a column alias in `WHERE`; `ORDER BY` runs after, so you can sort by one.

## Filtering

```sql
SELECT name, salary
FROM employees
WHERE dept_id = 2 AND salary >= 6000
ORDER BY salary DESC;
```

```text
name | salary
-----+-------
Finn | 8000
Dev  | 6500
(2 rows)
```

Operators: `=`, `<>` (or `!=`), `<`, `>`, `<=`, `>=`, `AND`, `OR`, `NOT`, `IN (...)`, `BETWEEN a AND b` (inclusive), `LIKE` with `%` (any run) and `_` (one character), `IS NULL`. Parenthesise mixed `AND`/`OR`; `AND` binds tighter.

```sql
SELECT name, hire_date
FROM employees
WHERE hire_date BETWEEN '2020-01-01' AND '2021-12-31'
   OR name LIKE 'H%'
ORDER BY hire_date;
```

```text
name | hire_date
-----+-----------
Ben  | 2020-06-15
Gia  | 2020-09-09
Cara | 2021-01-10
Hari | 2024-04-30
(4 rows)
```

## NULL

NULL is "unknown", not zero and not an empty string. Any comparison with NULL yields unknown, which `WHERE` treats as false. Only `IS NULL` / `IS NOT NULL` test for it.

```sql
SELECT name, dept_id
FROM employees
WHERE dept_id <> 1;
```

```text
name | dept_id
-----+--------
Dev  | 2
Esha | 2
Finn | 2
Gia  | 3
(4 rows)
```

`Hari` (dept_id NULL) is missing even though NULL is "not 1". To include such rows, say so explicitly:

```sql
SELECT name, dept_id
FROM employees
WHERE dept_id <> 1 OR dept_id IS NULL;
```

```text
name | dept_id
-----+--------
Dev  | 2
Esha | 2
Finn | 2
Gia  | 3
Hari | NULL
(5 rows)
```

Other NULL rules to state in interviews: aggregates ignore NULLs (`COUNT(col)` counts non-null values; `COUNT(*)` counts rows); `NULL = NULL` is not true, so joins never match NULL keys; `COALESCE(a, b, ...)` returns the first non-null; in `ORDER BY`, NULLs sort first or last depending on the database (PostgreSQL: last for ASC; MySQL and SQLite: first).

```sql
SELECT name, COALESCE(manager_id, 0) AS manager_or_zero
FROM employees
ORDER BY id;
```

```text
name | manager_or_zero
-----+----------------
Ava  | 0
Ben  | 1
Cara | 1
Dev  | 0
Esha | 4
Finn | 4
Gia  | 0
Hari | 1
(8 rows)
```

## DISTINCT, ORDER BY, LIMIT

```sql
SELECT DISTINCT country FROM customers ORDER BY country;
```

```text
country
-------
DE
IN
UK
US
(4 rows)
```

`DISTINCT` applies to the whole row of selected columns. `ORDER BY` accepts several keys and directions, column aliases, and positions (`ORDER BY 2 DESC`, avoid it in real code). `LIMIT n OFFSET m` pages results; SQL Server uses `TOP n` or `OFFSET ... FETCH`, Oracle `FETCH FIRST n ROWS ONLY`.

```sql
SELECT name, salary
FROM employees
ORDER BY salary DESC, name
LIMIT 3;
```

```text
name | salary
-----+-------
Ava  | 9000
Finn | 8000
Ben  | 7000
(3 rows)
```

Note the tie-breaker `name`: without it, the order of `Ben` and `Cara` is undefined. Always break ties when a question asks for "top N".

## CASE

Inline conditional logic; works in the select list, `ORDER BY`, and inside aggregates (next chapters).

```sql
SELECT name, salary,
       CASE
           WHEN salary >= 8000 THEN 'high'
           WHEN salary >= 6000 THEN 'mid'
           ELSE 'low'
       END AS band
FROM employees
ORDER BY salary DESC, name;
```

```text
name | salary | band
-----+--------+-----
Ava  | 9000   | high
Finn | 8000   | high
Ben  | 7000   | mid
Cara | 7000   | mid
Dev  | 6500   | mid
Hari | 6000   | mid
Esha | 5000   | low
Gia  | 4500   | low
(8 rows)
```

## Expressions and functions worth knowing

- Arithmetic: `salary * 1.1`, integer division differs by database (PostgreSQL `7 / 2 = 3`; MySQL `3.5`).
- Strings: `UPPER`, `LOWER`, `LENGTH`, `SUBSTR(s, start, len)`, `TRIM`, concatenation with `||` (standard, PostgreSQL, SQLite) or `CONCAT()` (MySQL, SQL Server).
- Dates: compare as strings in ISO format for portability; `EXTRACT(YEAR FROM d)` (PostgreSQL/MySQL), `YEAR(d)` (MySQL/SQL Server), `strftime('%Y', d)` (SQLite); `CURRENT_DATE`; date arithmetic differs everywhere.
- Rounding: `ROUND(x, 2)`.

```sql
SELECT UPPER(name) AS shout, LENGTH(name) AS len, salary * 12 AS annual
FROM employees
WHERE id <= 3
ORDER BY id;
```

```text
shout | len | annual
------+-----+-------
AVA   | 3   | 108000
BEN   | 3   | 84000
CARA  | 4   | 84000
(3 rows)
```

For a date range, prefer a half-open comparison; it is portable, index-friendly, and handles timestamps correctly:

```sql
SELECT id, order_date, amount
FROM orders
WHERE order_date >= '2026-02-01' AND order_date < '2026-03-01'
ORDER BY order_date;
```

```text
id  | order_date | amount
----+------------+-------
103 | 2026-02-02 | 1300
104 | 2026-02-14 | 100
(2 rows)
```

## Interview questions

**In what order are SQL clauses evaluated?**
FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. This is why `WHERE` cannot use select aliases and why `HAVING` exists for group filters.

**What is NULL and how do you test for it?**
The absence of a value. Comparisons with it are unknown; use `IS NULL` or `IS NOT NULL`. `COALESCE` substitutes a default.

**What is the difference between `COUNT(*)` and `COUNT(column)`?**
`COUNT(*)` counts rows; `COUNT(column)` counts rows where the column is not NULL. `COUNT(DISTINCT column)` counts distinct non-null values.

**What does `DISTINCT` do?**
Removes duplicate rows from the result, considering all selected columns together.

**Difference between `WHERE` and `HAVING`?**
`WHERE` filters rows before grouping; `HAVING` filters groups after aggregation. Next chapters.

**How do you get the top 3 rows?**
`ORDER BY ... LIMIT 3` (MySQL, PostgreSQL, SQLite), `TOP 3` (SQL Server), `FETCH FIRST 3 ROWS ONLY` (standard, Oracle, PostgreSQL). Break ties in the `ORDER BY`.

**What does `LIKE 'A%'` match?**
Values starting with A. `%` matches any sequence, `_` one character. Case sensitivity depends on the database and collation.

**Why write `date >= '2026-02-01' AND date < '2026-03-01'` instead of `BETWEEN`?**
The half-open range excludes the first instant of the next month, works for timestamps with times, and still uses an index. `BETWEEN` is inclusive at both ends.
