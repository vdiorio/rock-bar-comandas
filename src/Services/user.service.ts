import {PrismaClient} from '@prisma/client';
import Iuser from '../Interfaces/Iuser';
import HttpException from '../classes/httpException';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const {JWT_SECRET, SALT_ROUNDS} = process.env;
const jwtOptions: jwt.SignOptions = {algorithm: 'HS256', expiresIn: '24h'};

class UserService {
  private model;

  constructor() {
    this.model = new PrismaClient().user;
  }

  public getUsersByRole = async (role: string) => {
    if (role !== 'USER' && role !== 'SELLER') {
      throw new HttpException(400, `"${role}" não é uma opção valida`);
    }
    let users;
    if (role !== 'SELLER') {
      users = (
        await this.model.findMany({
          where: {OR: [{role}, {id: 1}]},
        })
      ).map((u) => {
        const user: Partial<Iuser> = {...u};
        delete user.password;
        return user;
      });
    } else {
      users = (
        await this.model.findMany({
          where: {OR: [{role}, {id: 1}]},
          include: {category: true},
        })
      ).map((u) => {
        const user = {
          id: u.id,
          username: u.username,
          role: u.role,
          email: u.email,
          name: u.name,
          cpf: u.cpf,
          category: u.category,
        };
        return user;
      });
    }
    return users;
  };

  public updateUser = async (id: number, data: Partial<Iuser>) => {
    if (data.password) {
      const password = bcrypt.hashSync(data.password, Number(SALT_ROUNDS));
      return this.model.update({where: {id}, data: {...data, password}});
    } else {
      return this.model.update({where: {id}, data});
    }
  };

  public createUser = async (userData: Iuser) => {
    try {
      const password = bcrypt.hashSync(userData.password, Number(SALT_ROUNDS));
      const data = {...userData, password};
      return this.model.create({data});
    } catch (error) {
      throw new HttpException(500);
    }
  };

  public findSellerCategory = async (id: number) => {
    const seller = await this.model.findUnique({where: {id}});
    return seller?.categoryId;
  };

  public authUser = async (email: string, password: string) => {
    const user = await this.model.findFirst({where: {email}});
    if (!user) throw new HttpException(404, 'Usuário inexistente');
    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) throw new HttpException(403, 'Senha incorreta');
    const tokenData = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(tokenData, JWT_SECRET!, jwtOptions);
    return {id: user.id, role: user.role, token};
  };

  public resetPassword = async (id: number, pass: string) => {
    const password = bcrypt.hashSync(pass, Number(SALT_ROUNDS));
    const updated = await this.model.update({where: {id}, data: {password}});
    return updated;
  };

  public adminCategoryUpdate = async (id: number, categoryId: number) => {
    const updated = await this.model.update({where: {id}, data: {categoryId}});
    return updated.categoryId;
  };
}

export default new UserService();
