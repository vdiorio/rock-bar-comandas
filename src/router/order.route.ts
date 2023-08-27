import {Router} from 'express';
import orderController from '../Controller/order.controller';

const router = Router();

const controller = orderController;

router.get('/', controller.getOrders);
router.post('/', controller.createOrder);
router.get('/:id', controller.getOrderById);
router.put('/:id', controller.cancelOrder);

export default router;
