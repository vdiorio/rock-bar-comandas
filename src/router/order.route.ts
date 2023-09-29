import {Router} from 'express';
import orderController from '../Controller/order.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = orderController;

const {checkAdmin, checkSeller, checkToken} = authMiddleware;

router.get('/', checkToken, checkSeller, controller.getOrders);
router.post('/', checkToken, checkAdmin, controller.createOrder);
router.get('/:id', checkToken, checkSeller, controller.getOrderById);
router.put('/:id', checkToken, checkSeller, controller.cancelOrder);
router.get('/pending/:id', controller.getPendingOrder);
router.post('/pending/', controller.createPendingOrder);
router.put(
  '/pending/:id',
  checkToken,
  checkAdmin,
  controller.confirmPendingOrder,
);

export default router;
