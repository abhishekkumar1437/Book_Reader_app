---
title: Modifying Data & Schema
part: Concepts
summary: INSERT, UPDATE with joins, DELETE versus TRUNCATE versus DROP, upserts, deleting duplicates, and the DDL you must know: keys, constraints, and ALTER.
---

## INSERT

```sql
INSERT INTO departments (id, name) VALUES (5, 'Support');
INSERT INTO employees (id, name, dept_id, manager_id, salary, hire_date)
VALUES (9, 'Ira', 5, 1, 5200, '2026-09-01');
```

```sql
SELECT id, name, dept_id, salary FROM employees WHERE id = 9;
```

```text
id | name | dept_id | salary
---+------+---------+-------
9  | Ira  | 5       | 5200
(1 row)
```

Insert from a query (copying or transforming rows):

```sql
CREATE TABLE salary_audit (employee_id INTEGER, salary INTEGER, noted_on DATE);
INSERT INTO salary_audit (employee_id, salary, noted_on)
SELECT id, salary, '2026-09-24' FROM employees WHERE dept_id = 1;
```

```sql
SELECT COUNT(*) AS audited FROM salary_audit;
```

```text
audited
-------
3
(1 row)
```

Always list the columns in `INSERT`; positional inserts break when the table changes.

## UPDATE

```sql
UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 3;
```

```sql
SELECT name, salary FROM employees WHERE dept_id = 3;
```

```text
name | salary
-----+-------
Gia  | 4950
(1 row)
```

Without `WHERE`, every row is updated. Say it out loud in interviews: "I would run the `SELECT` with the same `WHERE` first to see what will change."

Update based on another table (the syntax varies; the subquery form is portable):

```sql
UPDATE employees
SET salary = salary + 500
WHERE dept_id IN (SELECT id FROM departments WHERE name = 'Sales');
```

```sql
SELECT name, salary FROM employees WHERE dept_id = 2 ORDER BY name;
```

```text
name | salary
-----+-------
Dev  | 7000
Esha | 5500
Finn | 8500
(3 rows)
```

PostgreSQL and SQL Server allow `UPDATE ... FROM other_table WHERE ...`; MySQL allows `UPDATE a JOIN b ON ... SET ...`.

## DELETE, TRUNCATE, DROP

```sql
DELETE FROM salary_audit WHERE salary < 8000;
```

```sql
SELECT COUNT(*) AS remaining FROM salary_audit;
```

```text
remaining
---------
1
(1 row)
```

| Statement | Removes | Logged / rollback | Resets identity | Keeps table |
|---|---|---|---|---|
| `DELETE FROM t WHERE ...` | Matching rows | Row by row, can roll back | No | Yes |
| `TRUNCATE TABLE t` | All rows | Minimal logging, fast; rollback depends on the engine | Usually yes | Yes |
| `DROP TABLE t` | The table itself | DDL | n/a | No |

Foreign keys block deleting a parent row that has children unless the constraint says `ON DELETE CASCADE` (delete the children too) or `ON DELETE SET NULL`.

## Delete duplicates, keep one

The standard interview version. Number duplicates within each group and delete the extras. With `salary_audit` having no key, use `rowid` (SQLite) or `ctid` (PostgreSQL); with a proper `id` column, use that.

```sql
INSERT INTO salary_audit VALUES (1, 9000, '2026-09-24'), (1, 9000, '2026-09-24');
```

```sql
SELECT employee_id, salary, COUNT(*) AS copies FROM salary_audit GROUP BY employee_id, salary;
```

```text
employee_id | salary | copies
------------+--------+-------
1           | 9000   | 3
(1 row)
```

```sql
DELETE FROM salary_audit
WHERE rowid NOT IN (
    SELECT MIN(rowid) FROM salary_audit GROUP BY employee_id, salary, noted_on
);
```

```sql
SELECT employee_id, salary, COUNT(*) AS copies FROM salary_audit GROUP BY employee_id, salary;
```

```text
employee_id | salary | copies
------------+--------+-------
1           | 9000   | 1
(1 row)
```

The general pattern with a window function (PostgreSQL, SQL Server, MySQL 8 via a join):

```sql
-- no-run
DELETE FROM t
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY col1, col2 ORDER BY id) AS rn FROM t
    ) x WHERE rn > 1
);
```

## Upsert

Insert, or update if the key already exists. Each engine has its own spelling; the standard is `MERGE`.

```sql
INSERT INTO departments (id, name) VALUES (5, 'Customer Support')
ON CONFLICT (id) DO UPDATE SET name = excluded.name;
```

```sql
SELECT * FROM departments WHERE id = 5;
```

```text
id | name
---+-----------------
5  | Customer Support
(1 row)
```

- PostgreSQL and SQLite: `INSERT ... ON CONFLICT (key) DO UPDATE SET ...`
- MySQL: `INSERT ... ON DUPLICATE KEY UPDATE ...`
- SQL Server and Oracle: `MERGE INTO target USING source ON ... WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...`

## DDL: tables, keys, constraints

```sql
CREATE TABLE invoices (
    id           INTEGER PRIMARY KEY,
    order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_no   TEXT NOT NULL UNIQUE,
    amount       INTEGER NOT NULL CHECK (amount >= 0),
    issued_on    DATE NOT NULL DEFAULT CURRENT_DATE
);
```

| Constraint | Meaning |
|---|---|
| `PRIMARY KEY` | Unique and not null; identifies the row; one per table; usually indexed automatically |
| `FOREIGN KEY ... REFERENCES` | Value must exist in the parent table; enforces relationships |
| `UNIQUE` | No duplicate values (NULLs usually allowed, more than once in most engines) |
| `NOT NULL` | Value required |
| `CHECK` | Arbitrary condition per row |
| `DEFAULT` | Value when none is supplied |

Auto-incrementing keys: `SERIAL`/`GENERATED ALWAYS AS IDENTITY` (PostgreSQL), `AUTO_INCREMENT` (MySQL), `IDENTITY` (SQL Server), `INTEGER PRIMARY KEY AUTOINCREMENT` (SQLite).

`ALTER TABLE` adds or drops columns and constraints: `ALTER TABLE invoices ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';`. Adding a `NOT NULL` column to a big table needs a default or a backfill.

```sql
ALTER TABLE invoices ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';
INSERT INTO invoices (id, order_id, invoice_no, amount) VALUES (1, 101, 'INV-1', 1500);
```

```sql
SELECT id, order_id, invoice_no, amount, currency FROM invoices;
```

```text
id | order_id | invoice_no | amount | currency
---+----------+------------+--------+---------
1  | 101      | INV-1      | 1500   | INR
(1 row)
```

## Views

A saved query that behaves like a table. Use it to hide joins, restrict columns, or give a stable interface. A view has no data of its own (a **materialised view** does, and must be refreshed).

```sql
CREATE VIEW employee_directory AS
SELECT e.id, e.name, d.name AS department, m.name AS manager
FROM employees e
LEFT JOIN departments d ON d.id = e.dept_id
LEFT JOIN employees m ON m.id = e.manager_id;
```

```sql
SELECT * FROM employee_directory WHERE department = 'Sales' ORDER BY id;
```

```text
id | name | department | manager
---+------+------------+--------
4  | Dev  | Sales      | NULL
5  | Esha | Sales      | Dev
6  | Finn | Sales      | Dev
(3 rows)
```

## Interview questions

**`DELETE` versus `TRUNCATE` versus `DROP`?**
`DELETE` removes rows matching a condition and is fully logged and transactional; `TRUNCATE` removes all rows quickly with minimal logging and typically resets identity counters; `DROP` removes the table and its definition.

**What is a primary key? Can a table have two?**
A column or set of columns that uniquely identifies each row, not null. One per table, but it can be composite. Other unique identifiers use `UNIQUE` constraints (candidate keys).

**What is a foreign key?**
A column that references another table's primary (or unique) key, enforcing that the referenced row exists. `ON DELETE CASCADE`/`SET NULL`/`RESTRICT` define what happens when the parent goes.

**Primary key versus unique key?**
Both enforce uniqueness; a primary key also forbids NULL and there is only one; unique keys can be several and usually allow NULLs.

**How do you delete duplicate rows keeping one?**
Group by the duplicated columns, keep `MIN(id)` per group, delete the rest; or `ROW_NUMBER` partitioned by those columns and delete `rn > 1`.

**What is an upsert?**
Insert a row or update it if the key already exists: `ON CONFLICT DO UPDATE`, `ON DUPLICATE KEY UPDATE`, or `MERGE`.

**What is a view, and why use one?**
A stored query presented as a table. It simplifies access, restricts exposed columns, and gives a stable interface over changing tables. It does not store data unless materialised.

**Difference between `CHAR` and `VARCHAR`?**
`CHAR(n)` is fixed length and padded with spaces; `VARCHAR(n)` stores only the actual length up to n. Use `VARCHAR` (or `TEXT`) unless the value is always the same length.

**What does `ALTER TABLE` do?**
Changes a table's definition: add, drop, or modify columns and constraints. On large tables, some changes rewrite the table and lock it, so they are done carefully.
