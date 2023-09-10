import {Router} from 'express';
import productController from '../Controller/product.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = productController;

router.get('/', controller.getProducts);
router.get('/:id', controller.findById);
router.put('/:id', authMiddleware.checkAdmin, controller.updateProduct);
router.post('/', authMiddleware.checkAdmin, controller.createProduct);
router.delete('/:id', authMiddleware.checkAdmin, controller.deleteProduct);

export default router;
