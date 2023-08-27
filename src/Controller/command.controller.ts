import {NextFunction, Request, Response} from 'express';
import commandService from '../Services/command.service';

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

  public debitProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const commandId = Number(req.params.id);
      const products = req.body;
      console.log(req.body);
      const updated = await this.service.debitProduct(commandId, products);
      return res.status(201).json(updated);
    } catch (err) {
      next(err);
    }
  };
}

export default new CommandController();
