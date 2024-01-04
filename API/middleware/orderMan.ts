import { Request, Response, NextFunction } from 'express';
import orderDB from '../db/order';
import { Order } from '../models/order';

const isAuthToManOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userRole: string = req.user?.role;
    const userId: number = req.user?.id;
    const orderId: number = Number(req.params?.id);
    const order: Order| null = await orderDB.getOrderById(orderId);
    let user_id: number = 0;

    if(order) {
        user_id = order.user_id;
    } else {
        return res.status(404).send({ message: 'Order not found.' });
    }

    if (userRole === 'ADMIN' && userId === user_id) {
        return res.status(401).send({ message: 'You are not allowed to manage your orders as admin.' });
    } else if(userRole === 'ADMIN' && userId != user_id) {
        req.isAuthToManOrder = true;
        next();
    } else if (userRole != 'ADMIN' && userId != user_id) {
        return res.status(401).send({ message: 'You are not allowed to manage this order.' });
    } else if (userRole != 'ADMIN' && userId === user_id) {
        req.isAuthToManOrder = false;
        next();
    } else {
        return res.status(401).send({ message: 'Permission denied.' });
    } 
};

export default isAuthToManOrder;
