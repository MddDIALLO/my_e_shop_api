import { Router } from 'express';
import productRouter from './product.route';
import userRouter from './user.route'

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);

export default routes;