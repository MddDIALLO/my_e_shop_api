import { Request, Response, NextFunction } from 'express';
import orderDB from '../db/order';
import { Order } from '../models/order';

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
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

    if (userRole === 'ADMIN') {
        next();
    } else if(userRole != 'ADMIN' && userId === user_id) {
        next();
    } else if (userRole != 'ADMIN' && userId != user_id) {
        return res.status(401).send({ message: 'You are not allowed to cancel this order.' });
    } else {
        return res.status(401).send({ message: 'Permission denied.' });
    } 
};

export default cancelOrder;
