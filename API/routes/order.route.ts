import { Router } from 'express';
import orderController from '../controllers/order.controller';
// import authenticateToken from '../middleware/auth';
// import isAdmin from '../middleware/admin';

const orderRouter = Router();

orderRouter.get('/', orderController.getAllOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/', orderController.addNewOrder);
orderRouter.put('/:id', orderController.updateOrder);
orderRouter.delete('/:id', orderController.deleteOrderById);

export default orderRouter;