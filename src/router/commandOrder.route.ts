import {Router} from 'express';
import authMiddleware from '../Middlewares/auth.middleware';
import commandController from '../Controller/command.controller';

const router = Router();

const controller = commandController;

const {checkSeller, checkToken} = authMiddleware;

router.get('/', checkToken, checkSeller, controller.getOrdersBySellerId);
router.put('/:id', checkToken, checkSeller, controller.cancelProductOrder);

export default router;
