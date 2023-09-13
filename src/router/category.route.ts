import {Router} from 'express';
import authMiddleware from '../Middlewares/auth.middleware';
import categoryController from '../Controller/category.controller';

const router = Router();

const controller = categoryController;

const {checkToken, checkAdmin} = authMiddleware;

router.get('/', checkToken, checkAdmin, controller.getCategories);
router.post('/', checkToken, checkAdmin, controller.createCategories);
router.delete('/:id', checkToken, checkAdmin, controller.deleteCategory);

export default router;
