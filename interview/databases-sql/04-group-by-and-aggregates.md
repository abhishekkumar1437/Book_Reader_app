---
title: GROUP BY & Aggregates
part: Queries
summary: COUNT, SUM, AVG, MIN, MAX, grouping by one or more columns, HAVING versus WHERE, conditional aggregation with CASE, and the rule about non-aggregated columns.
---

## Aggregates collapse rows

Without `GROUP BY`, an aggregate turns the whole result into one row.

```sql
SELECT COUNT(*) AS employees,
       COUNT(dept_id) AS with_department,
       COUNT(DISTINCT dept_id) AS departments_used,
       SUM(salary) AS payroll,
       AVG(salary) AS avg_salary,
       MIN(salary) AS lowest,
       MAX(salary) AS highest
FROM employees;
```

```text
employees | with_department | departments_used | payroll | avg_salary | lowest | highest
----------+-----------------+------------------+---------+------------+--------+--------
8         | 7               | 3                | 53000   | 6625       | 4500   | 9000
(1 row)
```

`COUNT(dept_id)` is 7, not 8, because aggregates skip NULLs. `AVG` divides by the number of non-null values; if some salaries were NULL the average would silently exclude them.

## GROUP BY

One output row per distinct value of the grouping columns. Every column in the select list must be either grouped or aggregated; that is the rule interviewers check.

```sql
SELECT dept_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary, MAX(salary) AS top_salary
FROM employees
GROUP BY dept_id
ORDER BY dept_id;
```

```text
dept_id | headcount | avg_salary | top_salary
--------+-----------+------------+-----------
NULL    | 1         | 6000       | 6000
1       | 3         | 7666.67    | 9000
2       | 3         | 6500       | 8000
3       | 1         | 4500       | 4500
(4 rows)
```

NULL forms its own group (`Hari`). To show names instead of ids, join first, then group by the joined column:

```sql
SELECT d.name AS department, COUNT(e.id) AS headcount, COALESCE(SUM(e.salary), 0) AS payroll
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.id, d.name
ORDER BY payroll DESC;
```

```text
department  | headcount | payroll
------------+-----------+--------
Engineering | 3         | 23000
Sales       | 3         | 19500
HR          | 1         | 4500
Legal       | 0         | 0
(4 rows)
```

`Legal` appears with zero because of the left join and `COUNT(e.id)`; `SUM` of no rows is NULL, hence the `COALESCE`.

Group by several columns for finer grain:

```sql
SELECT c.country, o.status, COUNT(*) AS orders, SUM(o.amount) AS total
FROM orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.country, o.status
ORDER BY c.country, o.status;
```

```text
country | status    | orders | total
--------+-----------+--------+------
IN      | paid      | 3      | 700
UK      | paid      | 1      | 300
UK      | shipped   | 1      | 1200
US      | cancelled | 1      | 100
US      | paid      | 2      | 1700
US      | shipped   | 1      | 1300
(6 rows)
```

## HAVING versus WHERE

`WHERE` filters rows before they are grouped; `HAVING` filters groups after aggregation. Conditions on aggregates can only go in `HAVING`.

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
WHERE status <> 'cancelled'          -- row filter first
GROUP BY customer_id
HAVING COUNT(*) >= 2                 -- group filter after
ORDER BY total DESC;
```

```text
customer_id | orders | total
------------+--------+------
1           | 3      | 3000
2           | 2      | 1500
4           | 3      | 700
(3 rows)
```

Putting the row condition in `WHERE` rather than `HAVING` is also faster: fewer rows reach the grouping step.

## Conditional aggregation

`CASE` inside an aggregate counts or sums a subset per group without extra joins. This is how pivots and "how many of each status" are written.

```sql
SELECT customer_id,
       SUM(CASE WHEN status = 'paid'      THEN amount ELSE 0 END) AS paid,
       SUM(CASE WHEN status = 'shipped'   THEN amount ELSE 0 END) AS shipped,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)      AS cancelled_count
FROM orders
GROUP BY customer_id
ORDER BY customer_id;
```

```text
customer_id | paid | shipped | cancelled_count
------------+------+---------+----------------
1           | 1700 | 1300    | 0
2           | 300  | 1200    | 0
3           | 0    | 0       | 1
4           | 700  | 0       | 0
(4 rows)
```

PostgreSQL also offers `COUNT(*) FILTER (WHERE status = 'paid')`; the `CASE` form works everywhere.

## Aggregates with DISTINCT and expressions

```sql
SELECT p.category,
       COUNT(DISTINCT oi.order_id) AS orders_containing,
       SUM(oi.qty) AS units,
       SUM(oi.qty * p.price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.category
ORDER BY revenue DESC;
```

```text
category | orders_containing | units | revenue
---------+-------------------+-------+--------
hardware | 5                 | 6     | 4500
software | 6                 | 7     | 700
service  | 2                 | 2     | 100
(3 rows)
```

## Grouping and the "top per group" trap

`GROUP BY dept_id` with `MAX(salary)` gives the top salary per department, but you cannot add `name` to the select list to find *who* earns it: the name is not functionally determined by the group (MySQL's lax mode returns an arbitrary name, which is wrong). The correct tools are a join back to the aggregate or a window function (next chapters).

```sql
SELECT e.dept_id, e.name, e.salary
FROM employees e
JOIN (SELECT dept_id, MAX(salary) AS top FROM employees GROUP BY dept_id) t
  ON t.dept_id = e.dept_id AND t.top = e.salary
ORDER BY e.dept_id, e.name;
```

```text
dept_id | name | salary
--------+------+-------
1       | Ava  | 9000
2       | Finn | 8000
3       | Gia  | 4500
(3 rows)
```

If two people tied for a department's top salary, both would appear, which is usually what "highest paid per department" should return; say so. To return exactly one per group, use `ROW_NUMBER()` (window functions chapter).

## ROLLUP, briefly

`GROUP BY ROLLUP (a, b)` adds subtotal and grand-total rows. Know the name; write it only if asked (SQLite does not support it; PostgreSQL, MySQL, SQL Server do).

## Interview questions

**What is the difference between `WHERE` and `HAVING`?**
`WHERE` filters individual rows before grouping and cannot reference aggregates; `HAVING` filters groups after aggregation and can.

**Can you select a column that is not in `GROUP BY`?**
Only inside an aggregate. Otherwise it is an error in standard SQL (MySQL may return an arbitrary value, which is a bug waiting to happen).

**How do aggregates treat NULL?**
They ignore it. `COUNT(*)` counts all rows; `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` skip NULLs. `SUM` of no rows is NULL, not 0.

**How do you count rows per group including groups with zero?**
Start from the dimension table, `LEFT JOIN` the facts, and `COUNT(fact.id)` so unmatched groups count as 0.

**How do you find groups with more than one row (duplicates)?**
`GROUP BY the_columns HAVING COUNT(*) > 1`.

**How do you compute several conditional totals in one pass?**
`SUM(CASE WHEN condition THEN value ELSE 0 END)` per condition, or `FILTER` in PostgreSQL.

**What is the difference between `COUNT(DISTINCT x)` and `COUNT(x)`?**
Distinct non-null values versus all non-null values.

**Why is `SELECT dept_id, name, MAX(salary) ... GROUP BY dept_id` wrong?**
`name` is neither grouped nor aggregated; the database cannot know which name belongs to the max. Use a join back to the aggregate or `ROW_NUMBER()`.
