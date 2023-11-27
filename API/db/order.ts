import { Order } from '../models/order';
import { Order_item } from '../models/order_item';
import { connection } from '../config/db';
import { QueryError, PoolConnection, OkPacket } from 'mysql2';

const getAllOrders = (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            conn.query("select * from orders", (err, resultSet: Order[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

const getOrderById = (orderId: number): Promise<Order | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM orders WHERE id = ?", [orderId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                if (Array.isArray(result) && result.length === 0) {
                    return resolve(null);
                }

                const order: Order = result[0] as Order;
                return resolve(order);
            });
        });
    });
};

const getAllOrderItems = (orderId: number): Promise<Order_item[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM order_items WHERE order_id = ?", [orderId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                const orderItems: Order_item[] = result as Order_item[];
                return resolve(orderItems);
            });
        });
    });
};

const addNewOrder = (newOrder: Order): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            const query = 'INSERT INTO orders (user_id, status, total_cost) VALUES (?, ?, ?)';

            conn.query(query, [newOrder.user_id, newOrder.status, newOrder.total_cost], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.insertId);
            });
        });
    });
};

const addNewOrderItem = (newOrderItem: Order_item): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("INSERT INTO order_items SET ?", newOrderItem, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return resolve(0);
                }
                return resolve(1);
            });
        });
    });
};

const updateOrder = (orderId: number, updatedOrder: Order): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE orders SET ? WHERE id = ?", [updatedOrder, orderId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const updateOrderItem = (OrderItemId: number, updatedOrderItem: Order_item): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE order_items SET ? WHERE id = ?", [updatedOrderItem, OrderItemId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteOrder = (orderId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM orders WHERE id = ?", orderId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteOrderItem = (orderId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM order_items WHERE order_id = ?", orderId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

export default { 
                    getAllOrders, 
                    getOrderById, 
                    getAllOrderItems, 
                    addNewOrder, 
                    addNewOrderItem, 
                    updateOrder, 
                    updateOrderItem, 
                    deleteOrder, 
                    deleteOrderItem 
                };