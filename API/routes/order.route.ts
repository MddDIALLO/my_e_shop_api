import { Router } from 'express';
import orderController from '../controllers/order.controller';
import authenticateToken from '../middleware/auth';
import isAdmin from '../middleware/admin';
import isAuthToManOrder from '../middleware/orderMan';

const orderRouter = Router();

orderRouter.get('/', authenticateToken, isAdmin, orderController.getAllOrders);
orderRouter.get('/:id', authenticateToken, isAuthToManOrder, orderController.getOrderById);
orderRouter.post('/', authenticateToken, orderController.addNewOrder);
orderRouter.put('/:id', authenticateToken, isAuthToManOrder, orderController.updateOrder);
orderRouter.delete('/:id', authenticateToken, isAdmin, orderController.deleteOrderById);

export default orderRouter;