import {PrismaClient} from '@prisma/client';
import HttpException from '../classes/httpException';
import CommandService from './command.service';
import commandService from './command.service';

const {findOrCreate, updateCommand} = CommandService;

class OrderService {
  private model;

  constructor() {
    this.model = new PrismaClient().order;
  }

  public async createOrder(
    value: number,
    commandId: number,
    name: string | null = null,
  ) {
    const command = await findOrCreate(commandId);
    await updateCommand(command.id, value, name);
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

  public async cancelOrder(id: number) {
    const order = await this.model.findUnique({where: {id}});
    if (!order) throw new HttpException(404, 'Pedido inexistente');
    if (order.status === 'PAID') {
      await commandService.updateCommand(order.commandId, -order.value);
      return this.model.update({where: {id}, data: {status: 'CANCELLED'}});
    } else if (order.status === 'PENDING') {
      return this.model.delete({where: {id}});
    }
  }

  public async getPendingOrderById(id: number) {
    const order = await this.model.findFirst({where: {id, status: 'PENDING'}});
    if (!order) throw new HttpException(404, 'Pedido não encontrado');
    return order;
  }

  public async createPendingOrder(commandId: number, value: number) {
    return this.model.create({
      data: {
        commandId,
        value,
        status: 'PENDING',
      },
    });
  }

  public async confirmOrder(id: number) {
    await this.getPendingOrderById(id);
    return this.model.update({
      where: {id, status: 'PENDING'},
      data: {
        status: 'PAID',
      },
    });
  }

  public async findOrders() {
    return this.model.findMany();
  }

  public async findOrderById(id: number) {
    const order = await this.model.findUnique({where: {id}});
    if (!order) throw new HttpException(404, 'Pedido inexistente');
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
