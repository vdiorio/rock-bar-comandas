import {Router} from 'express';
import commandController from '../Controller/command.controller';

const router = Router();

const controller = commandController;

router.get('/', controller.getAllCommands);
router.put('/debit/:id', controller.debitProducts);
router.get('/:id', controller.getCommandById);
router.put('/:id', controller.updateCommandValue);
router.post('/', controller.createCommand);

export default router;
