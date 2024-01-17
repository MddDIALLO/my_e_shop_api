DROP DATABASE IF EXISTS C2WK_BACK_END_DB;
CREATE DATABASE C2WK_BACK_END_DB;
USE C2WK_BACK_END_DB;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'USER',
    created_by INT DEFAULT NULL,
    updated_by INT DEFAULT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    image_url VARCHAR(255) NULL,
    isActive BOOL DEFAULT true
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    made_date DATETIME DEFAULT NULL,
    expiry_date DATETIME DEFAULT NULL,
    image_url VARCHAR(255) NULL
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
  deliveryDate VARCHAR(255) DEFAULT '0000-00-00',
  shiping decimal(10,2) NOT NULL DEFAULT '0.00',
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (username, email, password, role) VALUES ('mdian', 'mdian@diari.com', 'Mdian123$', 'ADMIN'), 
                                                               ('diallo', 'diallo@diari.com', 'Diallo123$', 'USER');

INSERT INTO products (name, description) VALUES ('Milk', 'fresh Milk'),
                                                                       ('Fanta', 'fresh FANTA'),
                                                                       ('Rice', 'Long Rice');

INSERT INTO orders (user_id, status, total_cost) VALUES (3, 'pending', '20.99'),
                                                        (5, 'pending', '99.99'),
                                                        (11, 'pending', '59.99');

INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 1, 3),
                                                              (1, 3, 2),
                                                              (2, 1, 1),
                                                              (2, 4, 2),
                                                              (2, 5, 7),
                                                              (3, 3, 12);


INSERT INTO products (name, description, price)
VALUES
('Product 1', 'Description 1', 10.99),
('Product 2', 'Description 2', 15.50),
('Product 3', 'Description 3', 20.75),
('Product 4', 'Description 4', 10.99),
('Product 5', 'Description 5', 15.50),
('Product 6', 'Description 6', 20.75),
('Product 7', 'Description 7', 10.99),
('Product 8', 'Description 7', 15.50),
('Product 9', 'Description 9', 20.75),
('Product 10', 'Description 10', 20.75),
('Product 11', 'Description 11', 11.99),
('Product 12', 'Description 12', 55.50),
('Product 13', 'Description 13', 70.75),
('Product 14', 'Description 14', 13.99),
('Product 15', 'Description 15', 10.50),
('Product 16', 'Description 16', 90.75),
('Product 17', 'Description 17', 110.99),
('Product 18', 'Description 17', 75.50),
('Product 19', 'Description 19', 90.79),
('Product 20', 'Description 20', 200.75),
('Product 21', 'Description 21', 11.99),
('Product 22', 'Description 22', 55.50),
('Product 23', 'Description 23', 70.75),
('Product 24', 'Description 24', 13.99),
('Product 25', 'Description 25', 10.50),
('Product 26', 'Description 26', 90.75),
('Product 27', 'Description 27', 110.99),
('Product 28', 'Description 27', 75.50),
('Product 29', 'Description 29', 90.79),
('Product 30', 'Description 30', 200.75),
('Product 31', 'Description 31', 11.99),
('Product 32', 'Description 32', 55.50),
('Product 33', 'Description 33', 70.75),
('Product 34', 'Description 34', 13.99),
('Product 35', 'Description 35', 10.50),
('Product 36', 'Description 36', 90.75),
('Product 37', 'Description 37', 110.99),
('Product 38', 'Description 37', 75.50),
('Product 39', 'Description 39', 90.79),
('Product 40', 'Description 40', 200.75),
('Product 41', 'Description 41', 11.99),
('Product 42', 'Description 42', 55.50),
('Product 43', 'Description 43', 70.75),
('Product 44', 'Description 44', 13.99),
('Product 45', 'Description 45', 10.50),
('Product 46', 'Description 46', 90.75),
('Product 47', 'Description 47', 110.99),
('Product 48', 'Description 47', 75.50),
('Product 49', 'Description 49', 90.79),
('Product 50', 'Description 50', 99.99);
