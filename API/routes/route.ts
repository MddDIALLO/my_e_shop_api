import { Router } from 'express';
import productRouter from './product.route';
import userRouter from './user.route'
import orderRouter from './order.route';
import imageRouter from './image.route';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/orders', orderRouter);
routes.use('/images', imageRouter);

export default routes;