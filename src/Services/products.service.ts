import {PrismaClient} from '@prisma/client';
import HttpException from '../classes/httpException';
import Iproduct from '../Interfaces/Iproduct';

class ProductService {
  private model;

  constructor() {
    this.model = new PrismaClient().product;
  }

  public createProduct = async (
    name: string,
    price: number,
    categoryId: number,
  ) => {
    return this.model.create({
      data: {
        name,
        price,
        categoryId,
      },
    });
  };

  public findProducts = async (categoryId: number | null | undefined) => {
    if (categoryId) {
      return this.model.findMany({
        where: {categoryId},
      });
    } else {
      return this.model.findMany({
        include: {category: true},
      });
    }
  };

  public findById = async (id: number) => {
    const product = await this.model.findFirst({
      where: {id},
      include: {category: true},
    });
    if (!product) throw new HttpException(404, 'Produto inexistente');
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
