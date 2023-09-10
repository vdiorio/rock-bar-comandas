import {Router} from 'express';
import commandController from '../Controller/command.controller';
import authMiddleware from '../Middlewares/auth.middleware';

const router = Router();

const controller = commandController;

router.get(
  '/',
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  controller.getAllCommands,
);

router.put(
  '/debit/:id',
  authMiddleware.checkToken,
  authMiddleware.checkSeller,
  controller.debitProducts,
);

router.get('/:id', controller.getCommandById);

router.put(
  '/:id',
  authMiddleware.checkToken,
  authMiddleware.checkSeller,
  controller.updateCommandValue,
);

router.post(
  '/',
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  controller.createCommand,
);

export default router;
