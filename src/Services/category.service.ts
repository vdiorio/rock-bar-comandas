import {PrismaClient} from '@prisma/client';

class UserService {
  private model;

  constructor() {
    this.model = new PrismaClient().category;
  }

  public createCategory = async (data: {name: string}) => {
    return this.model.create({data});
  };

  public getCategories = async () => this.model.findMany();

  public deleteCategory = async (id: number) =>
    this.model.delete({where: {id}});
}

export default new UserService();
