---
title: Window Functions
part: Queries
summary: ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY, running totals, LAG and LEAD, and the top-N-per-group pattern. The single most valuable SQL skill for interviews above entry level.
---

## What a window function is

An aggregate computed **per row over a set of related rows**, without collapsing the rows. `SUM(...) OVER (...)` gives every row its group total; `ROW_NUMBER() OVER (...)` numbers rows. The `OVER` clause defines the window: `PARTITION BY` splits rows into groups, `ORDER BY` orders within the group, and an optional frame limits which rows are visible.

```sql
SELECT name, dept_id, salary,
       SUM(salary) OVER (PARTITION BY dept_id) AS dept_total,
       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg,
       salary - AVG(salary) OVER (PARTITION BY dept_id) AS diff_from_avg
FROM employees
ORDER BY dept_id, salary DESC;
```

```text
name | dept_id | salary | dept_total | dept_avg | diff_from_avg
-----+---------+--------+------------+----------+--------------
Hari | NULL    | 6000   | 6000       | 6000     | 0
Ava  | 1       | 9000   | 23000      | 7666.67  | 1333.33
Ben  | 1       | 7000   | 23000      | 7666.67  | -666.67
Cara | 1       | 7000   | 23000      | 7666.67  | -666.67
Finn | 2       | 8000   | 19500      | 6500     | 1500
Dev  | 2       | 6500   | 19500      | 6500     | 0
Esha | 2       | 5000   | 19500      | 6500     | -1500
Gia  | 3       | 4500   | 4500       | 4500     | 0
(8 rows)
```

Every employee row is still there, with its department's total and average alongside. That is the difference from `GROUP BY`, which would return one row per department.

Window functions are evaluated after `WHERE`, `GROUP BY`, and `HAVING`, so you cannot filter on them directly in the same query. Wrap the query in a CTE or derived table and filter outside; the top-N pattern below does exactly that.

## Ranking: ROW_NUMBER, RANK, DENSE_RANK

The three differ only in how they treat ties.

```sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense
FROM employees
ORDER BY salary DESC, name;
```

```text
name | salary | row_num | rnk | dense
-----+--------+---------+-----+------
Ava  | 9000   | 1       | 1   | 1
Finn | 8000   | 2       | 2   | 2
Ben  | 7000   | 3       | 3   | 3
Cara | 7000   | 4       | 3   | 3
Dev  | 6500   | 5       | 5   | 4
Hari | 6000   | 6       | 6   | 5
Esha | 5000   | 7       | 7   | 6
Gia  | 4500   | 8       | 8   | 7
(8 rows)
```

- `ROW_NUMBER` always gives 1, 2, 3, ... (ties broken arbitrarily unless the `ORDER BY` breaks them).
- `RANK` gives tied rows the same rank and skips the next values (1, 2, 3, 3, 5).
- `DENSE_RANK` gives tied rows the same rank without gaps (1, 2, 3, 3, 4).

"Nth highest salary" questions hinge on this: use `DENSE_RANK` if equal salaries count once, `ROW_NUMBER` if you want exactly one row.

## Top N per group

The most asked window question. Rank inside each partition, then keep the ranks you want.

```sql
WITH ranked AS (
    SELECT name, dept_id, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
    WHERE dept_id IS NOT NULL
)
SELECT dept_id, name, salary
FROM ranked
WHERE rnk <= 2
ORDER BY dept_id, salary DESC, name;
```

```text
dept_id | name | salary
--------+------+-------
1       | Ava  | 9000
1       | Ben  | 7000
1       | Cara | 7000
2       | Finn | 8000
2       | Dev  | 6500
3       | Gia  | 4500
(6 rows)
```

Change `rnk <= 2` to `rnk = 1` for "highest paid per department", or use `ROW_NUMBER` to guarantee one row per department even with ties.

## Running totals and moving averages

`ORDER BY` inside `OVER` turns an aggregate into a running one. The default frame is "from the start of the partition to the current row".

```sql
SELECT id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, id) AS running_total,
       AVG(amount) OVER (ORDER BY order_date, id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3
FROM orders
WHERE status <> 'cancelled'
ORDER BY order_date, id;
```

```text
id  | order_date | amount | running_total | moving_avg_3
----+------------+--------+---------------+-------------
101 | 2026-01-05 | 1500   | 1500          | 1500
102 | 2026-01-20 | 300    | 1800          | 900
103 | 2026-02-02 | 1300   | 3100          | 1033.33
105 | 2026-03-01 | 450    | 3550          | 683.33
106 | 2026-03-15 | 200    | 3750          | 650
107 | 2026-03-16 | 1200   | 4950          | 616.67
108 | 2026-03-30 | 150    | 5100          | 516.67
109 | 2026-03-31 | 100    | 5200          | 483.33
(8 rows)
```

Frame clauses: `ROWS BETWEEN n PRECEDING AND CURRENT ROW` (physical rows), `RANGE` (by value; the default with `ORDER BY`, which treats peers with equal order keys as one group; include a unique tie-breaker like `id` to avoid surprises), `UNBOUNDED PRECEDING`, `UNBOUNDED FOLLOWING`.

Per-customer running totals just add a partition:

```sql
SELECT customer_id, order_date, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS customer_running
FROM orders
WHERE customer_id IN (1, 2)
ORDER BY customer_id, order_date;
```

```text
customer_id | order_date | amount | customer_running
------------+------------+--------+-----------------
1           | 2026-01-05 | 1500   | 1500
1           | 2026-02-02 | 1300   | 2800
1           | 2026-03-15 | 200    | 3000
2           | 2026-01-20 | 300    | 300
2           | 2026-03-16 | 1200   | 1500
(5 rows)
```

## LAG and LEAD: the previous and next row

Compare each row with its neighbour without a self join: month-over-month change, time between events, consecutive-day checks.

```sql
SELECT id, order_date, amount,
       LAG(amount)  OVER (ORDER BY order_date, id) AS previous_amount,
       amount - LAG(amount) OVER (ORDER BY order_date, id) AS change,
       LEAD(order_date) OVER (ORDER BY order_date, id) AS next_order_date
FROM orders
ORDER BY order_date, id;
```

```text
id  | order_date | amount | previous_amount | change | next_order_date
----+------------+--------+-----------------+--------+----------------
101 | 2026-01-05 | 1500   | NULL            | NULL   | 2026-01-20
102 | 2026-01-20 | 300    | 1500            | -1200  | 2026-02-02
103 | 2026-02-02 | 1300   | 300             | 1000   | 2026-02-14
104 | 2026-02-14 | 100    | 1300            | -1200  | 2026-03-01
105 | 2026-03-01 | 450    | 100             | 350    | 2026-03-15
106 | 2026-03-15 | 200    | 450             | -250   | 2026-03-16
107 | 2026-03-16 | 1200   | 200             | 1000   | 2026-03-30
108 | 2026-03-30 | 150    | 1200            | -1050  | 2026-03-31
109 | 2026-03-31 | 100    | 150             | -50    | NULL
(9 rows)
```

`LAG(col, n, default)` looks `n` rows back with a default for the first rows. `FIRST_VALUE`, `LAST_VALUE`, and `NTH_VALUE` fetch specific rows of the frame (`LAST_VALUE` needs `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to mean what people expect).

## NTILE and percentages

`NTILE(4)` splits ordered rows into quartiles. Share-of-total is a window aggregate over the whole partition:

```sql
SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary) AS quartile,
       ROUND(100.0 * salary / SUM(salary) OVER (), 1) AS pct_of_payroll
FROM employees
ORDER BY salary, name;
```

```text
name | salary | quartile | pct_of_payroll
-----+--------+----------+---------------
Gia  | 4500   | 1        | 8.5
Esha | 5000   | 1        | 9.4
Hari | 6000   | 2        | 11.3
Dev  | 6500   | 2        | 12.3
Ben  | 7000   | 3        | 13.2
Cara | 7000   | 3        | 13.2
Finn | 8000   | 4        | 15.1
Ava  | 9000   | 4        | 17
(8 rows)
```

`OVER ()` with nothing inside means the window is the entire result.

## Window versus GROUP BY

| Want | Use |
|---|---|
| One row per group with totals | `GROUP BY` |
| Every row, plus its group's total or rank | window function |
| Top N per group | window `ROW_NUMBER`/`DENSE_RANK` in a CTE, then filter |
| Compare a row to the previous one | `LAG`/`LEAD` |
| Running or moving aggregate | window with `ORDER BY` and a frame |

Both can appear in one query: window functions run after `GROUP BY`, so you can rank grouped results (`RANK() OVER (ORDER BY SUM(amount) DESC)`).

## Interview questions

**What is a window function?**
A function computed over a set of rows related to the current row, defined by `OVER (PARTITION BY ... ORDER BY ...)`, that returns a value for every row without collapsing them.

**Difference between `ROW_NUMBER`, `RANK`, and `DENSE_RANK`?**
Unique sequential numbers; same rank for ties with gaps after; same rank for ties without gaps.

**How do you get the second highest salary?**
`DENSE_RANK() OVER (ORDER BY salary DESC)` and filter `= 2` in an outer query, or `SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)`.

**How do you get the top 3 per department?**
Rank with `PARTITION BY dept_id ORDER BY salary DESC` in a CTE, then `WHERE rnk <= 3`.

**Can you use a window function in `WHERE`?**
No; they are evaluated after `WHERE`. Put the query in a CTE or subquery and filter there.

**What does `PARTITION BY` do?**
Splits the rows into groups within which the function is computed independently, like `GROUP BY` without collapsing.

**What is `LAG` used for?**
Accessing the previous row's value in the ordered window, for differences and streak detection, without a self join.

**How do you compute a running total?**
`SUM(x) OVER (ORDER BY date)`; add `PARTITION BY` for per-entity totals.

**What is a frame clause?**
`ROWS`/`RANGE BETWEEN ... AND ...` inside `OVER`, restricting the window to a sliding range of rows around the current one. Default with `ORDER BY` is from the partition start to the current row.

**Window function or `GROUP BY` for department totals next to each employee?**
Window: `SUM(salary) OVER (PARTITION BY dept_id)`. `GROUP BY` would lose the individual rows.
