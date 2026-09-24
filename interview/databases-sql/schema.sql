-- Sample schema used by every chapter of the Databases & SQL book.
-- A small company: departments, employees (with managers), customers, products, orders, order items.

CREATE TABLE departments (
    id      INTEGER PRIMARY KEY,
    name    TEXT NOT NULL UNIQUE
);

CREATE TABLE employees (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    dept_id     INTEGER REFERENCES departments(id),
    manager_id  INTEGER REFERENCES employees(id),
    salary      INTEGER NOT NULL,
    hire_date   DATE NOT NULL
);

CREATE TABLE customers (
    id      INTEGER PRIMARY KEY,
    name    TEXT NOT NULL,
    country TEXT NOT NULL
);

CREATE TABLE products (
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    category TEXT NOT NULL,
    price    INTEGER NOT NULL
);

CREATE TABLE orders (
    id          INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_date  DATE NOT NULL,
    status      TEXT NOT NULL,
    amount      INTEGER NOT NULL
);

CREATE TABLE order_items (
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty        INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

INSERT INTO departments VALUES
    (1, 'Engineering'),
    (2, 'Sales'),
    (3, 'HR'),
    (4, 'Legal');

INSERT INTO employees VALUES
    (1, 'Ava',   1, NULL, 9000, '2019-03-01'),
    (2, 'Ben',   1, 1,    7000, '2020-06-15'),
    (3, 'Cara',  1, 1,    7000, '2021-01-10'),
    (4, 'Dev',   2, NULL, 6500, '2018-11-20'),
    (5, 'Esha',  2, 4,    5000, '2022-02-01'),
    (6, 'Finn',  2, 4,    8000, '2023-07-19'),
    (7, 'Gia',   3, NULL, 4500, '2020-09-09'),
    (8, 'Hari',  NULL, 1, 6000, '2024-04-30');

INSERT INTO customers VALUES
    (1, 'Acme',   'US'),
    (2, 'Bolt',   'UK'),
    (3, 'Cinder', 'US'),
    (4, 'Delta',  'IN'),
    (5, 'Echo',   'DE');

INSERT INTO products VALUES
    (1, 'Laptop',  'hardware', 1200),
    (2, 'Monitor', 'hardware', 300),
    (3, 'Licence', 'software', 100),
    (4, 'Support', 'service',  50),
    (5, 'Headset', 'accessory', 80);

INSERT INTO orders VALUES
    (101, 1, '2026-01-05', 'paid',      1500),
    (102, 2, '2026-01-20', 'paid',      300),
    (103, 1, '2026-02-02', 'shipped',   1300),
    (104, 3, '2026-02-14', 'cancelled', 100),
    (105, 4, '2026-03-01', 'paid',      450),
    (106, 1, '2026-03-15', 'paid',      200),
    (107, 2, '2026-03-16', 'shipped',   1200),
    (108, 4, '2026-03-30', 'paid',      150),
    (109, 4, '2026-03-31', 'paid',      100);

INSERT INTO order_items VALUES
    (101, 1, 1), (101, 2, 1),
    (102, 2, 1),
    (103, 1, 1), (103, 3, 1),
    (104, 3, 1),
    (105, 2, 1), (105, 3, 1), (105, 4, 1),
    (106, 3, 2),
    (107, 1, 1),
    (108, 3, 1), (108, 4, 1),
    (109, 3, 1);
