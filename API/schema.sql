DROP DATABASE IF EXISTS C2WK_BACK_END_DB;
CREATE DATABASE C2WK_BACK_END_DB;
USE C2WK_BACK_END_DB;

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_by INT DEFAULT NULL,
    updated_by INT DEFAULT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_by INT NULL,
    updated_by INT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status VARCHAR(255),
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  total_cost decimal(10,2) NOT NULL DEFAULT '0.00',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO roles (name) VALUES ('ADMIN'), ('USER');

INSERT INTO users (username, email, password, role_id) VALUES ('mdian', 'mdian@diari.com', 'Mdian123$', 1), 
                                                               ('diallo', 'diallo@diari.com', 'Diallo123$', 2);

INSERT INTO products (name, description, created_by, updated_by) VALUES ('Milk', 'fresh Milk', 1, 1),
                                                                       ('Fanta', 'fresh FANTA', 1, 1),
                                                                       ('Rice', 'Long Rice', 1, 1);

INSERT INTO orders (user_id, status, total_cost) VALUES (3, 'pending', '20.99'),
                                                        (5, 'pending', '99.99'),
                                                        (11, 'pending', '59.99');

INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 1, 3),
                                                              (1, 3, 2),
                                                              (2, 1, 1),
                                                              (2, 4, 2),
                                                              (2, 5, 7),
                                                              (3, 3, 12);