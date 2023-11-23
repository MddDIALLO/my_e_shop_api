import { User } from '../models/user';
import { connection } from '../config/db';
import { QueryError, PoolConnection, OkPacket } from 'mysql2';

const selectAll = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            conn.query("select * from users", (err, resultSet: User[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

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

export default { selectAll, addUser, updateUser, deleteUser };