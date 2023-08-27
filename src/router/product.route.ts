import {Router} from 'express';
import productController from '../Controller/product.controller';

const router = Router();

const controller = productController;

router.get('/', controller.getProducts);
router.get('/:id', controller.findById);
router.put('/:id', controller.updateProduct);
router.post('/', controller.createProduct);
router.delete('/:id', controller.deleteProduct);

export default router;
