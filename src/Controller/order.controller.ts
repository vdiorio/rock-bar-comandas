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
      const {value, commandId, name = null} = req.body;
      const order = await this.service.createOrder(
        Number(value),
        Number(commandId),
        name,
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
      const order = await this.service.cancelOrder(id);
      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };

  public getPendingOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.params;
      const order = await this.service.getPendingOrderById(Number(id));
      return res.status(200).json(order);
    } catch (e) {
      next(e);
    }
  };

  public confirmPendingOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.params;
      const order = await this.service.confirmOrder(Number(id));
      return res.status(200).json(order);
    } catch (e) {
      next(e);
    }
  };

  public createPendingOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {commandId, value} = req.body;
      const order = await this.service.createPendingOrder(
        Number(commandId),
        Number(value),
      );
      return res.status(200).json(order);
    } catch (e) {
      next(e);
    }
  };
}

export default new OrderController();
