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

  public async findCommands() {
    return this.model.findMany({orderBy: {value: 'desc'}});
  }

  public findCommandbyId = async (id: number) => {
    const command = await this.model.findUnique({
      where: {id},
      include: {
        productOrders: {include: {products: true, seller: true}},
        orders: {
          orderBy: {orderedAt: 'desc'},
          take: 30,
        },
      },
    });
    if (!command) {
      throw new HttpException(404, 'Comanda não encontrada');
    }
    return command;
  };

  public findOrCreate = async (id: number) => {
    const upsert = await this.model.upsert({
      where: {id},
      update: {},
      create: {id},
    });
    return upsert;
  };

  public updateCommand = async (
    id: number,
    addValue: number | null = null,
    name: string | null = null,
  ) => {
    let data = {};
    if (addValue) {
      const {value} = await this.findCommandbyId(id);
      const newValue = value + addValue;
      if (newValue < 0) {
        throw new HttpException(
          400,
          `Não foi possível debitar R$${Math.abs(addValue).toFixed(
            2,
          )} da comanda ${id}. O valor atual da comanda é R$${value.toFixed(
            2,
          )}`,
        );
      }
      data = {value: newValue};
    }
    if (name) {
      data = {...data, name};
    }
    return this.model.update({
      where: {id},
      data,
    });
  };
}

export default new CommandService();
