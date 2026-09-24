---
title: Joins
part: Queries
summary: INNER, LEFT, RIGHT, FULL, self and cross joins, the anti-join for "rows with no match", why row counts multiply, and the join questions every SQL interview includes.
---

## The four joins in one picture

```
INNER  : rows with a match in both tables
LEFT   : all rows from the left table, matched right rows or NULLs
RIGHT  : all rows from the right table, matched left rows or NULLs
FULL   : all rows from both, NULLs where there is no match
```

`INNER JOIN` drops rows without a partner. `LEFT JOIN` keeps every left row. That single difference is the content of most join questions.

## INNER JOIN

```sql
SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON d.id = e.dept_id
ORDER BY e.id;
```

```text
name | department
-----+------------
Ava  | Engineering
Ben  | Engineering
Cara | Engineering
Dev  | Sales
Esha | Sales
Finn | Sales
Gia  | HR
(7 rows)
```

`Hari` (no department) and `Legal` (no employees) are both absent. `JOIN` means `INNER JOIN`.

## LEFT JOIN

```sql
SELECT e.name, d.name AS department
FROM employees e
LEFT JOIN departments d ON d.id = e.dept_id
ORDER BY e.id;
```

```text
name | department
-----+------------
Ava  | Engineering
Ben  | Engineering
Cara | Engineering
Dev  | Sales
Esha | Sales
Finn | Sales
Gia  | HR
Hari | NULL
(8 rows)
```

Every employee appears; `Hari` gets NULL for the department.

**Filter placement matters.** A condition on the right table in `WHERE` turns a left join back into an inner join, because NULL rows fail the test. Put it in the `ON` clause to keep unmatched rows:

```sql
SELECT d.name AS department, e.name
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id AND e.salary > 6800
ORDER BY d.id, e.name;
```

```text
department  | name
------------+-----
Engineering | Ava
Engineering | Ben
Engineering | Cara
Sales       | Finn
HR          | NULL
Legal       | NULL
(6 rows)
```

`HR` and `Legal` still appear (with NULL) because the salary condition is in `ON`; `Sales` keeps only `Finn`. Move the condition to `WHERE` and the NULL rows vanish. This is a favourite interview probe.

## RIGHT and FULL

`RIGHT JOIN` is a `LEFT JOIN` with the tables swapped; most people rewrite it as a left join for readability. `FULL OUTER JOIN` keeps unmatched rows from both sides (MySQL lacks it; emulate with `LEFT JOIN ... UNION ... RIGHT JOIN`).

```sql
SELECT d.name AS department, e.name AS employee
FROM employees e
FULL OUTER JOIN departments d ON d.id = e.dept_id
WHERE e.id IS NULL OR d.id IS NULL;
```

```text
department | employee
-----------+---------
NULL       | Hari
Legal      | NULL
(2 rows)
```

The `WHERE` keeps only the unmatched rows from either side: a department with no staff and an employee with no department.

## The anti-join: rows with no match

"Customers who have never ordered" is asked in every SQL interview. Three equivalent answers; know all three and prefer the first two.

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

```text
name
----
Echo
(1 row)
```

```sql
SELECT c.name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

```text
name
----
Echo
(1 row)
```

```sql
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);
```

```text
name
----
Echo
(1 row)
```

The `IS NOT NULL` in the `NOT IN` version is essential: if the subquery returns any NULL, `NOT IN` returns no rows at all. `NOT EXISTS` has no such trap, which is why it is the safer answer.

## Self join

A table joined to itself, for hierarchies and comparisons between rows of the same table. Aliases are mandatory.

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;
```

```text
employee | manager
---------+--------
Ava      | NULL
Ben      | Ava
Cara     | Ava
Dev      | NULL
Esha     | Dev
Finn     | Dev
Gia      | NULL
Hari     | Ava
(8 rows)
```

"Employees earning more than their manager" is the same join with a condition:

```sql
SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;
```

```text
employee | salary | manager | manager_salary
---------+--------+---------+---------------
Finn     | 8000   | Dev     | 6500
(1 row)
```

## Joining several tables

Chain joins; each `ON` relates the new table to something already joined. Many-to-many relationships go through the junction table.

```sql
SELECT o.id AS order_id, c.name AS customer, p.name AS product, oi.qty, p.price * oi.qty AS line_total
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.id IN (101, 105)
ORDER BY o.id, p.name;
```

```text
order_id | customer | product | qty | line_total
---------+----------+---------+-----+-----------
101      | Acme     | Laptop  | 1   | 1200
101      | Acme     | Monitor | 1   | 300
105      | Delta    | Licence | 1   | 100
105      | Delta    | Monitor | 1   | 300
105      | Delta    | Support | 1   | 50
(5 rows)
```

## Why row counts multiply

A join produces one row per **matching pair**. If the right side has three matches for a left row, that row appears three times. Summing a column from the left side after such a join triples the total. The fix is to aggregate the many side first (in a subquery or CTE) and then join, or to be sure which side is one-to-many before summing.

```sql
SELECT c.name, COUNT(o.id) AS orders, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total DESC, c.name;
```

```text
name   | orders | total
-------+--------+------
Acme   | 3      | 3000
Bolt   | 2      | 1500
Delta  | 3      | 700
Cinder | 1      | 100
Echo   | 0      | NULL
(5 rows)
```

`COUNT(o.id)` gives 0 for `Echo` because the join produced a NULL order; `COUNT(*)` would give 1, which is wrong.

## CROSS JOIN

Every row paired with every row; used for generating combinations (all products for all months, a calendar table). Rarely needed; usually a sign of a missing `ON`.

```sql
SELECT d.name AS department, p.category
FROM departments d
CROSS JOIN (SELECT DISTINCT category FROM products) p
WHERE d.id <= 2
ORDER BY d.name, p.category;
```

```text
department  | category
------------+----------
Engineering | accessory
Engineering | hardware
Engineering | service
Engineering | software
Sales       | accessory
Sales       | hardware
Sales       | service
Sales       | software
(8 rows)
```

## USING and NATURAL

`JOIN departments USING (dept_id)` works when both columns share a name. `NATURAL JOIN` matches all same-named columns automatically and is avoided in practice because a new column can silently change the join.

## Interview questions

**Inner versus left join?**
Inner returns only matching rows; left returns all left-table rows with NULLs where the right side has no match.

**How do you find rows in A with no match in B?**
Left join B and filter `WHERE b.key IS NULL`, or `NOT EXISTS`. Avoid `NOT IN` unless the subquery excludes NULLs.

**What is a self join?**
Joining a table to itself with aliases, typically to relate rows to other rows (employee to manager, consecutive events).

**What happens if you put a right-table condition in `WHERE` after a `LEFT JOIN`?**
Unmatched rows (whose right-side columns are NULL) fail the condition and are dropped; the result is effectively an inner join. Put such conditions in `ON`.

**Why did my totals double after adding a join?**
The joined table has several rows per key, so each left row was duplicated. Aggregate the many side before joining, or count distinct keys.

**What is a cross join?**
The Cartesian product: every row with every row. Useful for generating combinations; usually a bug otherwise.

**Difference between `ON` and `WHERE`?**
`ON` defines how rows match (and, for outer joins, which unmatched rows are kept); `WHERE` filters the joined result.

**What is a full outer join and when would you use it?**
All rows from both tables, matched where possible. Used to reconcile two lists (what is in one and not the other).

**Does join order matter for performance?**
Not for correctness; the optimiser reorders. It matters for readability and, in some engines, for hints. Indexes on join keys matter far more.
