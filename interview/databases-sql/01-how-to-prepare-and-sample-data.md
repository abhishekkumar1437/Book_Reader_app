---
title: How to Prepare, and the Sample Data
part: Getting Started
summary: What database interviews actually ask, how to answer a SQL question at the whiteboard, and the six-table sample schema every query in this book runs against.
---

## What gets asked

Database questions in interviews fall into three groups, in this order of frequency:

1. **Write a query.** Joins, grouping, filtering groups, subqueries, window functions, and a handful of classic puzzles (nth highest salary, duplicates, top per group, customers with no orders). This is most of the round.
2. **Explain a concept in two sentences.** Index, primary versus foreign key, `WHERE` versus `HAVING`, inner versus left join, ACID, normalization, isolation levels, SQL versus NoSQL.
3. **Fix or speed up something.** Why is this query slow, what index would you add, why are there duplicate rows.

This book covers exactly those three groups and nothing else. Chapters 2 to 7 are the queries; 8 to 11 are the concepts; 12 is a rapid-fire question bank.

## How to answer a query question

1. **Restate the output.** "One row per department with the highest-paid employee's name." Say the grain of the result before writing anything.
2. **Name the tables and the join keys.** "employees joined to departments on dept_id."
3. **Write it in stages.** Start with the `FROM` and joins, then `WHERE`, then grouping, then the select list, then ordering. Say each clause as you write it.
4. **Check the edge cases out loud.** Ties, NULLs, rows with no match, empty groups. Interviewers listen for these.
5. **State one thing you would change for scale.** An index on the join or filter column is usually enough.

If you do not remember exact syntax, say the standard form and note that dialects differ. Nobody fails for writing `LIMIT 1` instead of `FETCH FIRST 1 ROW ONLY`.

## The sample schema

Every query in this book runs against this data, and every result shown is the real output. Read it once; the rest of the book refers to it constantly.

```
departments(id, name)
employees(id, name, dept_id → departments, manager_id → employees, salary, hire_date)
customers(id, name, country)
products(id, name, category, price)
orders(id, customer_id → customers, order_date, status, amount)
order_items(order_id → orders, product_id → products, qty)     primary key (order_id, product_id)
```

```sql
SELECT * FROM departments;
```

```text
id | name
---+------------
1  | Engineering
2  | Sales
3  | HR
4  | Legal
(4 rows)
```

```sql
SELECT id, name, dept_id, manager_id, salary, hire_date FROM employees;
```

```text
id | name | dept_id | manager_id | salary | hire_date
---+------+---------+------------+--------+-----------
1  | Ava  | 1       | NULL       | 9000   | 2019-03-01
2  | Ben  | 1       | 1          | 7000   | 2020-06-15
3  | Cara | 1       | 1          | 7000   | 2021-01-10
4  | Dev  | 2       | NULL       | 6500   | 2018-11-20
5  | Esha | 2       | 4          | 5000   | 2022-02-01
6  | Finn | 2       | 4          | 8000   | 2023-07-19
7  | Gia  | 3       | NULL       | 4500   | 2020-09-09
8  | Hari | NULL    | 1          | 6000   | 2024-04-30
(8 rows)
```

Two things are deliberate: `Hari` has no department and `Ava`, `Dev`, `Gia` have no manager, so NULL handling matters; `Ben` and `Cara` share a salary, so ties matter.

```sql
SELECT * FROM customers;
```

```text
id | name   | country
---+--------+--------
1  | Acme   | US
2  | Bolt   | UK
3  | Cinder | US
4  | Delta  | IN
5  | Echo   | DE
(5 rows)
```

```sql
SELECT * FROM products;
```

```text
id | name    | category  | price
---+---------+-----------+------
1  | Laptop  | hardware  | 1200
2  | Monitor | hardware  | 300
3  | Licence | software  | 100
4  | Support | service   | 50
5  | Headset | accessory | 80
(5 rows)
```

```sql
SELECT * FROM orders;
```

```text
id  | customer_id | order_date | status    | amount
----+-------------+------------+-----------+-------
101 | 1           | 2026-01-05 | paid      | 1500
102 | 2           | 2026-01-20 | paid      | 300
103 | 1           | 2026-02-02 | shipped   | 1300
104 | 3           | 2026-02-14 | cancelled | 100
105 | 4           | 2026-03-01 | paid      | 450
106 | 1           | 2026-03-15 | paid      | 200
107 | 2           | 2026-03-16 | shipped   | 1200
108 | 4           | 2026-03-30 | paid      | 150
109 | 4           | 2026-03-31 | paid      | 100
(9 rows)
```

`Echo` has no orders, order 104 is cancelled, and `Delta` ordered on two consecutive days. The `Headset` product has never been ordered.

```sql
SELECT * FROM order_items;
```

```text
order_id | product_id | qty
---------+------------+----
101      | 1          | 1
101      | 2          | 1
102      | 2          | 1
103      | 1          | 1
103      | 3          | 1
104      | 3          | 1
105      | 2          | 1
105      | 3          | 1
105      | 4          | 1
106      | 3          | 2
107      | 1          | 1
108      | 3          | 1
108      | 4          | 1
109      | 3          | 1
(14 rows)
```

## Reading the result blocks

Results are shown as a table with a row count. `NULL` is printed as `NULL`. Where the ordering of a result is not fixed by an `ORDER BY`, the book adds one so the output is deterministic; in an interview, always add `ORDER BY` when the question implies an order.

## Dialects

The queries use standard SQL that runs unchanged on PostgreSQL, MySQL, SQLite, and (with small exceptions noted in place) SQL Server and Oracle. Where a common feature differs, a short note gives the variants. Do not spend preparation time on dialect trivia; spend it on the query patterns.
