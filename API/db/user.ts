import { User } from '../models/user';
import { connection } from '../config/db';
import { QueryError, PoolConnection } from 'mysql2';

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

            conn.query("INSERT INTO users SET ?", newUser, (err, result) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(result.insertId);
            });
        });
    });
};

// function addUser(username: string, email: string, password: string, role_id: number): void {
//     const query = 'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)';

//     connection.getConnection((err: QueryError, conn: PoolConnection) => {
//         conn.query(query, [username, email, password, role_id], (err) => {
//             if (err) {
//                 console.error('Error inserting user data:', err);
//             } else {
//                 console.log('User data inserted successfully.');
//             }
//         });
//     });

// }

// export function updatePassword(username: string, newPassword: string): void {
//     const query = 'UPDATE users SET `password` = ? WHERE username = ?';

//     db.query(query, [newPassword, username], (error, results) => {
//         if (error) {
//             console.error('Error updating password:', error);
//         } else {
//             console.log('Password updated successfully.');
//         }
//     });
// }

// export function getTableData(statement: string): Promise<any[]> {
//     return new Promise((resolve, reject) => {
//         const query = statement;
//         const tableData: any[] = [];

//         db.query(query, (error, result) => {
//             if (error) {
//                 console.error(error);
//                 reject(error);
//             } else {
//                 console.log('Table Found');
//                 const data = <RowDataPacket[]>result;

//                 for (let i = 0; i < data.length; i++) {
//                     tableData.push(data[i]);
//                 }

//                 resolve(tableData);
//             }
//         });
//     });
// }

export default { selectAll, addUser };