import { Product } from '../models/product';
import { connection } from '../config/db';
import { QueryError, PoolConnection } from 'mysql2';

const selectAll = (): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: QueryError, conn: PoolConnection) => {
            conn.query("select * from products", (err, resultSet: Product[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

export default { selectAll };