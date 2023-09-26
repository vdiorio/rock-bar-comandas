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

  public updateCommand = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const value = Number(req.query.value);
      const name = req.query.name as string;
      const command = await this.service.updateCommand(id, value, name);
      return res.status(200).json(command);
    } catch (err) {
      next(err);
    }
  };

  public createProductOrder = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const commandId = Number(req.params.id);
      const products = req.body;
      const sellerId = req.headers.userData.id;
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
      const orders = await command_productsService.getOrdersBySellerId(
        Number(id),
      );
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };

  public cancelProductOrder = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const {id} = req.headers.userData;
    const orderId = Number(req.params.id);
    const updated = await command_productsService.cancelProductOrder(
      orderId,
      id,
    );
    return res.status(201).json(updated);
  };

  public getTotalItemsSold = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const {id} = req.headers.userData;
    const products = await command_productsService.getTotalSells(id);
    console.log(products);
    return res.status(201).json(products);
  };
}

export default new CommandController();
