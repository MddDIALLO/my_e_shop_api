import { User } from '../models/user';
import { connection } from '../config/db';
import { QueryError, PoolConnection, OkPacket } from 'mysql2';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const selectAll = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("select * from users", (err, resultSet: User[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
};

const getUserById = (userId: number): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }

                if (Array.isArray(result) && result.length === 0) {
                    return resolve(null);
                }

                const user: User = result[0] as User;
                return resolve(user);
            });
        });
    });
};

const getUserByUsernameOrEmail = (identifier: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query(
                "SELECT * FROM users WHERE username = ? OR email = ?",
                [identifier, identifier],
                (err, result) => {
                    conn.release();
                    if (err) {
                        return reject(err);
                    }

                    if (Array.isArray(result) && result.length === 0) {
                        return resolve(null);
                    }

                    const user: User = result[0] as User;
                    return resolve(user);
                }
            );
        });
    });
};


const addUser = (newUser: User): Promise<number> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("INSERT INTO users SET ?", newUser, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.insertId);
            });
        });
    });
};

const updateUser = (userId: number, updatedUser: User): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("UPDATE users SET ? WHERE id = ?", [updatedUser, userId], (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

const deleteUser = (userId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            if (err) {
                conn.release();
                return reject(err);
            }

            conn.query("DELETE FROM users WHERE id = ?", userId, (err, result: OkPacket) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.affectedRows > 0);
            });
        });
    });
};

export default { validateEmail, validatePassword, selectAll, getUserById, getUserByUsernameOrEmail, addUser, updateUser, deleteUser };