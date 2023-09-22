import {NextFunction, Request, Response} from 'express';
import commandService from '../Services/command.service';
import command_productsService from '../Services/command_orders.service';
import IcustomRequest from '../Interfaces/IcustomHeader';
import command_ordersService from '../Services/command_orders.service';

class CommandController {
  private service;

  constructor() {
    this.service = commandService;
  }

  public createCommand = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const command = await this.service.createCommand();
      return res.status(200).json(command);
    } catch (err) {
      next(err);
    }
  };

  public getAllCommands = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const commands = await this.service.findCommands();
      return res.status(200).json(commands);
    } catch (err) {
      next(err);
    }
  };

  public getCommandById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const command = await this.service.findCommandbyId(id);
      return res.status(200).json(command);
    } catch (err) {
      next(err);
    }
  };

  public updateCommandValue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const value = Number(req.query.value);
      console.log(req.query);
      const command = await this.service.updateCommandValue(id, value);
      return res.status(200).json(command);
    } catch (err) {
      next(err);
    }
  };

  public createProductOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const commandId = Number(req.params.id);
      const products = req.body;
      const sellerId = 1;
      const updated = await command_ordersService.createProductOrder(
        commandId,
        sellerId,
        products,
      );
      return res.status(201).json(updated);
    } catch (err) {
      next(err);
    }
  };

  public getOrdersBySellerId = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.headers.userData;
      console.log(req.headers.userData);
      const orders = await command_productsService.getOrdersBySellerId(
        Number(id),
      );
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };
}

export default new CommandController();
