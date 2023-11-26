import { Router } from 'express';
import productController from '../controllers/product.controller';
import authenticateToken from '../middleware/auth';
import isAdmin from '../middleware/admin';

const productRouter = Router();

productRouter.get('/', authenticateToken, productController.getAll);
productRouter.get('/:id', authenticateToken, productController.getProductById);
productRouter.post('/', authenticateToken, isAdmin, productController.addNewProduct);
productRouter.put('/:id', authenticateToken, isAdmin, productController.updateExistingProduct);
productRouter.delete('/:id', authenticateToken, isAdmin, productController.deleteProductById);

export default productRouter;