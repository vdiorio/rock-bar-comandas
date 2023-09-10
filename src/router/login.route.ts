import {Router} from 'express';
import userController from '../Controller/user.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = userController;

router.get('/validate-role', authMiddleware.checkToken, controller.validate);
router.post('/', controller.login);

export default router;
