import { Router } from 'express';
import productRouter from './product.route';
import userRouter from './user.route'
import orderRouter from './order.route';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/orders', orderRouter);

export default routes;