import {Router} from 'express';
import userController from '../Controller/user.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = userController;

const {checkToken, checkAdmin} = authMiddleware;

router.put('/upcat/:id', checkToken, checkAdmin, controller.updateCategory);
router.get('/:role', checkToken, checkAdmin, controller.getUsersByRole);
router.put('/:id', checkToken, checkAdmin, controller.adminResetPassword);
router.post('/', checkToken, checkAdmin, controller.createUser);

export default router;
