import {PrismaClient} from '@prisma/client';
import HttpException from '../classes/httpException';
import Iproduct from '../Interfaces/Iproduct';

class ProductService {
  private model;

  constructor() {
    this.model = new PrismaClient().product;
  }

  public createProduct = async (name: string, price: number, photo: string) => {
    return this.model.create({
      data: {
        name,
        price,
      },
    });
  };

  public findProducts = async (sellerid: number) => {
    if (sellerid) {
      return this.model.findMany({
        where: {sellerid},
      });
    } else {
      return this.model.findMany({
        include: {seller: {select: {name: true, id: true}}},
      });
    }
  };

  public findById = async (id: number) => {
    const product = await this.model.findFirst({
      where: {id},
      include: {seller: {select: {name: true, id: true}}},
    });
    if (!product) throw new HttpException(404);
    return product;
  };

  public updateProduct = async (
    id: number,
    updatedProduct: Partial<Iproduct>,
  ) => {
    await this.findById(id);
    return this.model.update({where: {id}, data: updatedProduct});
  };

  public deleteProduct = async (id: number) => {
    return this.model.delete({where: {id}});
  };
}

const productService = new ProductService();

export default productService;
