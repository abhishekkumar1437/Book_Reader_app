---
title: Classic Interview Queries
part: Queries
summary: The queries that come up in interview after interview, each solved and run: nth highest salary, duplicates, top per group, employees above their manager, customers without orders, month totals, running totals, first order per customer, pivots, medians, consecutive records.
---

## How to use this chapter

Cover the SQL, write your own from the problem statement, then compare. The result blocks are real outputs on the sample data from chapter 1. Where two solutions are standard, both are shown; be able to explain which you would choose.

## 1. Second (nth) highest salary

Distinct salaries, so ties count once.

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

```text
second_highest
--------------
8000
(1 row)
```

General nth with `DENSE_RANK` (here n = 3):

```sql
SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees) t
WHERE rnk = 3;
```

```text
salary
------
7000
(1 row)
```

Or `SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2` (MySQL, PostgreSQL, SQLite). Say what happens when there is no nth value: the `MAX` form returns NULL, the others return no rows.

## 2. Highest paid employee in each department

```sql
WITH ranked AS (
    SELECT e.name, d.name AS department, e.salary,
           ROW_NUMBER() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC, e.name) AS rn
    FROM employees e
    JOIN departments d ON d.id = e.dept_id
)
SELECT department, name, salary FROM ranked WHERE rn = 1 ORDER BY department;
```

```text
department  | name | salary
------------+------+-------
Engineering | Ava  | 9000
HR          | Gia  | 4500
Sales       | Finn | 8000
(3 rows)
```

Use `DENSE_RANK() ... = 1` instead if ties should all be returned.

## 3. Find duplicate values

Which salaries occur more than once, and who has them.

```sql
SELECT salary, COUNT(*) AS occurrences
FROM employees
GROUP BY salary
HAVING COUNT(*) > 1;
```

```text
salary | occurrences
-------+------------
7000   | 2
(1 row)
```

```sql
SELECT e.name, e.salary
FROM employees e
JOIN (SELECT salary FROM employees GROUP BY salary HAVING COUNT(*) > 1) d ON d.salary = e.salary
ORDER BY e.salary, e.name;
```

```text
name | salary
-----+-------
Ben  | 7000
Cara | 7000
(2 rows)
```

Deleting duplicates (keeping one) is in the modification chapter.

## 4. Employees earning more than their manager

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

## 5. Customers with no orders, and customers with only cancelled orders

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
SELECT c.name
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
HAVING SUM(CASE WHEN o.status <> 'cancelled' THEN 1 ELSE 0 END) = 0;
```

```text
name
------
Cinder
(1 row)
```

## 6. Monthly revenue with month-over-month change

Portable month extraction uses `SUBSTR` on an ISO date; in PostgreSQL use `DATE_TRUNC('month', order_date)`, in MySQL `DATE_FORMAT(order_date, '%Y-%m')`.

```sql
WITH monthly AS (
    SELECT SUBSTR(order_date, 1, 7) AS month, SUM(amount) AS revenue
    FROM orders
    WHERE status <> 'cancelled'
    GROUP BY SUBSTR(order_date, 1, 7)
)
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change_from_prev
FROM monthly
ORDER BY month;
```

```text
month   | revenue | change_from_prev
--------+---------+-----------------
2026-01 | 1800    | NULL
2026-02 | 1300    | -500
2026-03 | 2100    | 800
(3 rows)
```

## 7. Running total of orders per customer

```sql
SELECT customer_id, id AS order_id, order_date, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date, id) AS running_total
FROM orders
ORDER BY customer_id, order_date, id;
```

```text
customer_id | order_id | order_date | amount | running_total
------------+----------+------------+--------+--------------
1           | 101      | 2026-01-05 | 1500   | 1500
1           | 103      | 2026-02-02 | 1300   | 2800
1           | 106      | 2026-03-15 | 200    | 3000
2           | 102      | 2026-01-20 | 300    | 300
2           | 107      | 2026-03-16 | 1200   | 1500
3           | 104      | 2026-02-14 | 100    | 100
4           | 105      | 2026-03-01 | 450    | 450
4           | 108      | 2026-03-30 | 150    | 600
4           | 109      | 2026-03-31 | 100    | 700
(9 rows)
```

## 8. Each customer's first order

```sql
WITH numbered AS (
    SELECT customer_id, id, order_date, amount,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date, id) AS rn
    FROM orders
)
SELECT c.name, n.id AS first_order, n.order_date, n.amount
FROM numbered n
JOIN customers c ON c.id = n.customer_id
WHERE n.rn = 1
ORDER BY c.name;
```

```text
name   | first_order | order_date | amount
-------+-------------+------------+-------
Acme   | 101         | 2026-01-05 | 1500
Bolt   | 102         | 2026-01-20 | 300
Cinder | 104         | 2026-02-14 | 100
Delta  | 105         | 2026-03-01 | 450
(4 rows)
```

The `GROUP BY customer_id, MIN(order_date)` approach gives the date but not the order's other columns; the window version gives the whole row.

## 9. Department headcount and average, only departments with more than one employee

```sql
SELECT d.name, COUNT(*) AS headcount, ROUND(AVG(e.salary), 0) AS avg_salary
FROM employees e
JOIN departments d ON d.id = e.dept_id
GROUP BY d.id, d.name
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;
```

```text
name        | headcount | avg_salary
------------+-----------+-----------
Engineering | 3         | 7667
Sales       | 3         | 6500
(2 rows)
```

## 10. Pivot: orders per status as columns

```sql
SELECT c.name,
       SUM(CASE WHEN o.status = 'paid'      THEN 1 ELSE 0 END) AS paid,
       SUM(CASE WHEN o.status = 'shipped'   THEN 1 ELSE 0 END) AS shipped,
       SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;
```

```text
name   | paid | shipped | cancelled
-------+------+---------+----------
Acme   | 2    | 1       | 0
Bolt   | 1    | 1       | 0
Cinder | 0    | 0       | 1
Delta  | 3    | 0       | 0
Echo   | 0    | 0       | 0
(5 rows)
```

## 11. Median salary

No portable `MEDIAN`. Number the rows from both ends and take the middle one or two.

```sql
WITH ordered AS (
    SELECT salary,
           ROW_NUMBER() OVER (ORDER BY salary, id) AS asc_n,
           ROW_NUMBER() OVER (ORDER BY salary DESC, id DESC) AS desc_n
    FROM employees
)
SELECT AVG(salary) AS median
FROM ordered
WHERE asc_n IN (desc_n, desc_n - 1, desc_n + 1);
```

```text
median
------
6750
(1 row)
```

With eight rows the middle two (6500 and 7000) are averaged. The `id` tie-breakers matter: without them the two orderings can number the tied 7000s inconsistently and the middle row is missed. PostgreSQL has `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)`.

## 12. Products never ordered, and best-selling product by units

```sql
SELECT p.name
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.order_id IS NULL;
```

```text
name
-------
Headset
(1 row)
```

```sql
SELECT p.name, SUM(oi.qty) AS units
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY units DESC, p.name
LIMIT 1;
```

```text
name    | units
--------+------
Licence | 7
(1 row)
```

## 13. Customers who bought every product in a category

"Division" questions: count distinct matches and compare to the total.

```sql
SELECT c.name
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id AND p.category = 'hardware'
GROUP BY c.id, c.name
HAVING COUNT(DISTINCT p.id) = (SELECT COUNT(*) FROM products WHERE category = 'hardware')
ORDER BY c.name;
```

```text
name
----
Acme
Bolt
(2 rows)
```

## 14. Orders placed on consecutive days by the same customer

```sql
WITH seq AS (
    SELECT customer_id, order_date,
           LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_date
    FROM orders
)
SELECT customer_id, prev_date, order_date
FROM seq
WHERE julianday(order_date) - julianday(prev_date) = 1;
```

```text
customer_id | prev_date  | order_date
------------+------------+-----------
4           | 2026-03-30 | 2026-03-31
(1 row)
```

`julianday` is SQLite; use `order_date - prev_date = 1` in PostgreSQL or `DATEDIFF(order_date, prev_date) = 1` in MySQL. The pattern (`LAG` then a date difference) is what matters; it also solves "users active on consecutive days" and "gaps in a sequence".

## 15. Employees hired in the same year, counted

```sql
SELECT SUBSTR(hire_date, 1, 4) AS year, COUNT(*) AS hires, GROUP_CONCAT(name, ', ') AS who
FROM employees
GROUP BY SUBSTR(hire_date, 1, 4)
ORDER BY year;
```

```text
year | hires | who
-----+-------+---------
2018 | 1     | Dev
2019 | 1     | Ava
2020 | 2     | Ben, Gia
2021 | 1     | Cara
2022 | 1     | Esha
2023 | 1     | Finn
2024 | 1     | Hari
(7 rows)
```

`GROUP_CONCAT` is MySQL/SQLite; PostgreSQL uses `STRING_AGG(name, ', ' ORDER BY name)`, SQL Server `STRING_AGG`.

## 16. Percentage of orders per status

```sql
SELECT status,
       COUNT(*) AS orders,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM orders), 1) AS pct
FROM orders
GROUP BY status
ORDER BY orders DESC;
```

```text
status    | orders | pct
----------+--------+-----
paid      | 6      | 66.7
shipped   | 2      | 22.2
cancelled | 1      | 11.1
(3 rows)
```

`100.0 *` forces decimal arithmetic; `100 * COUNT(*) / total` would be integer division in several databases.

## 17. Rows with the maximum value, without a window

```sql
SELECT id, customer_id, amount
FROM orders
WHERE amount = (SELECT MAX(amount) FROM orders);
```

```text
id  | customer_id | amount
----+-------------+-------
101 | 1           | 1500
(1 row)
```

`ORDER BY amount DESC LIMIT 1` returns one row even on ties; the subquery form returns all tied rows. Know which the question wants.

## 18. Salary rank within department and overall

```sql
SELECT name, dept_id, salary,
       DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS overall_rank
FROM employees
WHERE dept_id IS NOT NULL
ORDER BY dept_id, dept_rank, name;
```

```text
name | dept_id | salary | dept_rank | overall_rank
-----+---------+--------+-----------+-------------
Ava  | 1       | 9000   | 1         | 1
Ben  | 1       | 7000   | 2         | 3
Cara | 1       | 7000   | 2         | 3
Finn | 2       | 8000   | 1         | 2
Dev  | 2       | 6500   | 2         | 4
Esha | 2       | 5000   | 3         | 5
Gia  | 3       | 4500   | 1         | 6
(7 rows)
```

## Interview questions about these

**Which solution for nth highest is best?**
`DENSE_RANK` in a subquery: general for any n, handles ties, and reads clearly. The nested `MAX` works only for n = 2.

**How do you delete duplicates but keep one?**
Number them with `ROW_NUMBER() OVER (PARTITION BY the_columns ORDER BY id)` and delete where `rn > 1` (via a CTE or a subquery on the key). Modification chapter.

**Why `NOT EXISTS` for "no orders" rather than `NOT IN`?**
`NOT IN` returns nothing if the subquery contains a NULL; `NOT EXISTS` does not have that problem and short-circuits.

**How do you get the whole row for the max per group?**
`ROW_NUMBER` in a CTE and filter `rn = 1`, or join back to the grouped `MAX`.

**How do you compute month-over-month growth?**
Aggregate per month, then `LAG` over the months.

**How do you pivot rows into columns?**
Conditional aggregation with `CASE`; some databases have `PIVOT`, but `CASE` is portable.
