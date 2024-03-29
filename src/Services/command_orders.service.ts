import {PrismaClient} from '@prisma/client';
import productService from './products.service';
import commandService from './command.service';
import HttpException from '../classes/httpException';

class CommandOrders {
  private model;

  private prisma = new PrismaClient();

  constructor() {
    this.model = this.prisma.commandOrder;
  }

  public getOrdersByCommandId = async (commandId: number) => {
    return this.model.findMany({where: {commandId}});
  };

  public getOrdersBySellerId = async (sellerId: number) => {
    return this.model.findMany({
      where: {sellerId},
      include: {products: {include: {product: true}}},
    });
  };

  public getTotalSells = async (sellerId: number) => {
    const products: any[] = await this.prisma.$queryRaw` SELECT
      p.name AS productName,
      SUM(cp.quantity) AS quantitySold
    FROM
      "CommandOrder" co
    JOIN
      "CommandProducts" cp ON co.id = cp."orderId"
    JOIN
      "Product" p ON cp."productId" = p.id
    WHERE
      co."sellerId" = ${sellerId} AND co.status = 'OK'
    GROUP BY
      p.name`;
    return products.map((product: any) => ({
      product: product.productname,
      sold: Number(product.quantitysold),
    }));
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
    if (value <= 0) throw new HttpException(403, 'Pedido vazio');
    await commandService.updateCommand(commandId, -value);
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

  public getOrderById = async (id: number) => {
    const order = await this.model.findUnique({
      where: {id},
      include: {products: true},
    });
    if (!order) throw new HttpException(404, 'Pedido inexistente');
    console.log(order);
    return order;
  };

  public cancelProductOrder = async (orderId: number, sellerId: number) => {
    const order = await this.getOrderById(orderId);
    if (sellerId !== order.sellerId) {
      throw new HttpException(403, 'Não autorizado');
    } else if (order.status !== 'OK') {
      throw new HttpException(403, 'Pedido já cancelado');
    }
    commandService.updateCommand(order.commandId, order.value);
    return await this.model.update({
      where: {id: orderId},
      data: {status: 'CANCELLED'},
    });
  };
}

export default new CommandOrders();
