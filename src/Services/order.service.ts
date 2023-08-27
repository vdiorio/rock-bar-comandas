import {PrismaClient} from '@prisma/client';
import HttpException from '../classes/httpException';
import CommandService from './command.service';

const {findCommandbyId, updateCommandValue} = CommandService;

class OrderService {
  private model;

  constructor() {
    this.model = new PrismaClient().order;
  }

  public async createOrder(value: number, commandId: number) {
    const command = await findCommandbyId(commandId);
    updateCommandValue(command.id, value);
    const newOrder = await this.model.create({
      data: {
        commandId,
        value,
        status: 'PAID',
      },
      include: {command: true},
    });
    return newOrder;
  }

  public async cancelOrder(id: number, status: string) {
    const order = await this.model.findUnique({where: {id}});
    if (!order) throw new HttpException(404);
    return this.model.update({where: {id}, data: {status: 'CANCELLED'}});
  }

  public async findOrders() {
    return this.model.findMany();
  }

  public async findOrderById(id: number) {
    const order = await this.model.findUnique({where: {id}});
    if (!order) throw new HttpException(404);
    return order;
  }

  public async getOrdersByDate(startDate: Date, endDate: Date) {
    return this.model.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}

export default new OrderService();
