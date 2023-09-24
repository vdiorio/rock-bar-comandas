import {NextFunction, Request, Response} from 'express';
import orderService from '../Services/order.service';

class OrderController {
  private service;

  constructor() {
    this.service = orderService;
  }

  public getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {startDate, endDate} = req.query as {
        startDate: string;
        endDate: string;
      };
      if (startDate && endDate) {
        const orders = await this.service.getOrdersByDate(
          new Date(startDate),
          new Date(endDate),
        );
        return res.status(200).json(orders);
      }
      return res.status(200).json(await this.service.findOrders());
    } catch (err) {
      next(err);
    }
  };

  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const order = await this.service.findOrderById(id);
      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };

  public createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {value, commandId} = req.body;
      const order = await this.service.createOrder(
        Number(value),
        Number(commandId),
      );
      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };

  public cancelOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.body;
      const order = this.service.cancelOrder(id);
      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };
}

export default new OrderController();
