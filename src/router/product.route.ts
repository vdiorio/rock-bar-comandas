import {Router} from 'express';
import productController from '../Controller/product.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = productController;

const {checkToken, checkAdmin} = authMiddleware;

router.get('/', controller.getProducts);
router.get('/:id', controller.findById);
router.put('/:id', checkToken, checkAdmin, controller.updateProduct);
router.post('/', checkToken, checkAdmin, controller.createProduct);
router.delete('/:id', checkToken, checkAdmin, controller.deleteProduct);

export default router;
