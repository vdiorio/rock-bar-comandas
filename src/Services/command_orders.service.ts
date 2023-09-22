import {PrismaClient} from '@prisma/client';
import productService from './products.service';
import commandService from './command.service';

class CommandOrders {
  private model;

  constructor() {
    this.model = new PrismaClient().commandOrder;
  }

  public getOrdersByCommandId = async (commandId: number) => {
    return this.model.findMany({where: {commandId}});
  };

  public getOrdersBySellerId = async (sellerId: number) => {
    return this.model.findMany({where: {sellerId}});
  };

  public createProductOrder = async (
    commandId: number,
    sellerId: number,
    products: {productId: number; quantity: number}[],
  ) => {
    let value = 0;
    const promises = products.map((p) =>
      productService
        .findById(p.productId)
        .then((pr) => (value += pr.price * p.quantity)),
    );
    await Promise.all(promises);
    commandService.updateCommandValue(-value);
    const order = await this.model.create({
      data: {
        commandId,
        sellerId,
        value,
        products: {
          createMany: {
            data: products.map(({productId, quantity}) => ({
              productId,
              quantity,
            })),
          },
        },
      },
    });
    return order;
  };
}

export default new CommandOrders();
