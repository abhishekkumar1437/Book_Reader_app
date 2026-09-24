---
title: Database Design Essentials
part: Concepts
summary: Keys and relationships, normalization to third normal form in plain words, when to denormalise, and the SQL versus NoSQL answer in the length an interview wants.
---

## Keys

- **Primary key**: uniquely identifies a row; not null; one per table. Prefer a compact surrogate (auto-increment or generated id) unless a natural key is short and truly stable.
- **Candidate key**: any column set that could serve as the primary key (email, national id). Enforce with `UNIQUE`.
- **Foreign key**: a column referencing another table's primary key; makes the relationship explicit and enforced.
- **Composite key**: a key of several columns, common for junction tables (`order_items(order_id, product_id)`).
- **Surrogate versus natural**: surrogate keys are meaningless integers or UUIDs and never change; natural keys carry meaning (an email) and can change, which cascades everywhere.

## Relationships

| Relationship | How it is modelled | Example in the sample schema |
|---|---|---|
| One-to-many | Foreign key on the "many" side | `orders.customer_id → customers` |
| Many-to-many | A junction table with two foreign keys, usually a composite primary key | `order_items(order_id, product_id)` |
| One-to-one | Foreign key with a `UNIQUE` constraint, or the same primary key in both tables | a `user_profiles` table keyed by `user_id` |
| Self-referencing | Foreign key to the same table | `employees.manager_id → employees` |

Drawing this as an entity-relationship diagram (boxes for tables, lines with crow's feet for the many side) is what "design the schema for X" questions want, followed by the column list and keys.

## Normalization

Organising tables so that each fact is stored once. The goal is to avoid **update anomalies** (change a customer's address in one order row but not the others), **insert anomalies** (cannot add a product until someone orders it), and **delete anomalies** (deleting the last order of a customer loses the customer).

**First normal form (1NF)**: every column holds one atomic value; no repeating groups or comma-separated lists. A `phone_numbers` column with `"111, 222"` violates it; a `phones` table fixes it.

**Second normal form (2NF)**: 1NF, and every non-key column depends on the **whole** primary key. Only matters with composite keys. In `order_items(order_id, product_id, qty, product_name)`, `product_name` depends only on `product_id`, so it moves to `products`.

**Third normal form (3NF)**: 2NF, and non-key columns depend only on the key, not on other non-key columns (no transitive dependencies). In `employees(id, dept_id, dept_name)`, `dept_name` depends on `dept_id`, not on the employee, so it moves to `departments`.

The memory aid: every non-key column depends on **the key, the whole key, and nothing but the key**. Beyond 3NF (BCNF, 4NF, 5NF) is rarely asked; say they exist and handle rarer dependency shapes.

The sample schema is in 3NF: departments, products, and customers are stored once and referenced by id.

## Denormalization

Deliberately duplicating data to make reads faster or simpler: storing `order.total` instead of summing items, keeping `customer_name` on an order for the invoice, maintaining a `post.like_count` counter. It trades write complexity (keeping copies in sync) and storage for read speed. Do it when a measured read path needs it, and keep the source of truth normalised. Reporting databases and data warehouses (star schemas with fact and dimension tables) are denormalised by design.

## Choosing types and constraints

- Use the narrowest correct type: `INTEGER` ids, `DECIMAL` for money (never float), `DATE`/`TIMESTAMP` for time (store in UTC), `BOOLEAN` where supported, `VARCHAR`/`TEXT` for strings.
- Add `NOT NULL` unless NULL has a real meaning.
- Add `UNIQUE`, `CHECK`, and foreign keys; the database enforcing rules beats every application doing it separately.
- Name consistently: singular or plural tables, `snake_case` columns, `_id` suffix for foreign keys, `created_at`/`updated_at` timestamps.

## A design walkthrough, briefly

"Design the schema for a library." Say: entities are books, copies (a title has many physical copies), members, and loans. `books(id, isbn UNIQUE, title, author)`, `copies(id, book_id → books, condition)`, `members(id, email UNIQUE, name)`, `loans(id, copy_id → copies, member_id → members, borrowed_on, due_on, returned_on NULL)`. A copy is on loan when it has a loan with `returned_on IS NULL`; enforce one active loan per copy with a partial unique index where the database supports it. Indexes on `loans(member_id)`, `loans(copy_id)`, and `loans(due_on) WHERE returned_on IS NULL` for overdue queries. That is a complete answer in under two minutes.

## SQL versus NoSQL, the interview-length version

| | Relational (SQL) | NoSQL (document, key-value, wide-column, graph) |
|---|---|---|
| Schema | Fixed, enforced; migrations to change | Flexible per record |
| Relationships | Joins and foreign keys | Embed or duplicate; joins are manual |
| Transactions | ACID across tables | Usually per document or per key; some offer more |
| Scaling | Vertical first; read replicas; sharding is manual | Horizontal partitioning built in |
| Query | Powerful ad hoc SQL | Query by key or designed access paths |
| Use when | Data is relational, integrity matters, queries vary | Massive scale with simple access patterns, or naturally document-shaped data |

The answer interviewers want: default to relational; choose a NoSQL store for a specific reason (write volume beyond one primary, key-based access at scale, flexible documents), and name the cost (no joins, weaker consistency, access patterns designed up front). The System Design book's database chapter covers the choice in more depth.

## Interview questions

**What is normalization and why do it?**
Structuring tables so each fact is stored once, preventing update, insert, and delete anomalies and inconsistency. 1NF atomic values, 2NF whole-key dependency, 3NF no transitive dependencies.

**What is denormalization and when is it acceptable?**
Duplicating data to speed up reads. Acceptable when a measured read path needs it and the copies are kept in sync deliberately, or in reporting schemas.

**Primary key versus foreign key?**
The primary key identifies a row in its table; a foreign key references a primary key in another (or the same) table to enforce a relationship.

**How do you model many-to-many?**
A junction table with foreign keys to both sides, usually with a composite primary key on the pair.

**Surrogate or natural keys?**
Surrogate by default: stable, compact, never changes. Natural keys become `UNIQUE` constraints.

**What is an ER diagram?**
A picture of entities (tables), their attributes, and relationships with cardinality, used to design and communicate a schema.

**When would you pick NoSQL over SQL?**
When the access pattern is simple and known, the write or data volume exceeds one primary, or the data is document-shaped and schema-flexible; and when joins and cross-record transactions are not needed.

**What data type for money?**
`DECIMAL(precision, scale)`, never floating point, to avoid rounding errors.

**What is referential integrity?**
The guarantee, enforced by foreign keys, that a reference always points to an existing row; with defined behaviour (`CASCADE`, `SET NULL`, `RESTRICT`) when the parent changes.

**What is a star schema?**
A reporting design with a central fact table (measurements, foreign keys) surrounded by dimension tables (who, what, when); denormalised for fast aggregation.
