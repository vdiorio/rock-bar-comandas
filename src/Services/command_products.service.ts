import {PrismaClient} from '@prisma/client';

class CommandProductsService {
  private model;

  constructor() {
    this.model = new PrismaClient().commandProducts;
  }

  public getOrdersBySellerId = async (sellerid: number) => {
    const orders = await this.model.findMany({
      where: {product: {sellerid}},
      take: 50,
      include: {product: {select: {name: true}}},
    });
    return orders.map(
      ({id, commandId, quantity, orderedAt, product: {name}}) => ({
        id,
        comanda: commandId,
        product: name,
        quantity,
        orderedAt,
      }),
    );
  };
}

export default new CommandProductsService();
