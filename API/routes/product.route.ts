import { Router } from 'express';
import productController from '../controllers/product.controller';

const productRouter = Router();

productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getProductById);
// productRouter.post('/', productController.addNewProduct);
// productRouter.put('/:id', productController.updateExistingProduct);
// productRouter.delete('/:id', productController.deleteProductById);

export default productRouter;