import {PrismaClient} from '@prisma/client';
import HttpException from '../classes/httpException';

class CommandService {
  private model;
  private modelProducts;
  private modelCommandProducts;

  constructor() {
    const prisma = new PrismaClient();
    this.model = prisma.command;
    this.modelProducts = prisma.product;
    this.modelCommandProducts = prisma.commandProducts;
  }

  public async createCommand() {
    return this.model.create({});
  }

  public async findCommands() {
    return this.model.findMany({orderBy: {value: 'desc'}});
  }

  public findCommandbyId = async (id: number) => {
    const command = await this.model.findUnique({
      where: {id},
      include: {
        products: {
          include: {product: true},
        },
        orders: {
          orderBy: {orderedAt: 'desc'},
          take: 30,
        },
      },
    });
    if (!command) {
      throw new HttpException(404);
    }
    const mappedProducts = {
      id: command.id,
      value: command.value,
      orders: command.orders,
      products: command.products.map(
        ({product: {name}, quantity, orderedAt}) => ({
          productName: name,
          quantity,
          orderedAt,
        }),
      ),
    };
    return mappedProducts;
  };

  public updateCommandValue = async (id: number, addValue: number) => {
    const {value} = await this.findCommandbyId(id);
    const newValue = value + addValue;
    if (newValue < 0) {
      throw new HttpException(
        400,
        `Não foi possível debitar R$${Math.abs(addValue).toFixed(
          2,
        )} da comanda ${id}. O valor atual da comanda é R$${value.toFixed(2)}`,
      );
    }
    return this.model.update({
      where: {id},
      data: {value: newValue},
    });
  };

  public debitProduct = async (
    commandId: number,
    productList: {productId: number; quantity: number}[],
  ) => {
    const productIds = productList.map(({productId}) => productId);
    const quantity = productList.map(({quantity}) => quantity);

    const command = await this.findCommandbyId(commandId);

    const products = await this.modelProducts.findMany({
      where: {id: {in: productIds}},
    });

    if (products.length !== productList.length) throw new HttpException(404);

    const debitValue = products.reduce(
      (acc, curr, i) => acc + curr.price * quantity[i],
      0,
    );

    if (command.value - debitValue < 0) {
      throw new HttpException(
        400,
        `Saldo insuficiente, o valor na comanda é R$ ${command.value.toFixed(
          2,
        )}`,
      );
    }

    const updatedCommand = await this.updateCommandValue(
      commandId,
      -debitValue,
    );

    await this.modelCommandProducts.createMany({
      data: productList.map(({productId, quantity}) => ({
        commandId,
        productId,
        quantity,
      })),
    });

    return updatedCommand;
  };
}

export default new CommandService();
