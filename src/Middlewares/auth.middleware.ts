import {Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../classes/httpException';
import IcustomRequest from '../Interfaces/IcustomHeader';

const {JWT_SECRET} = process.env;

class AuthMiddleware {
  public checkToken = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token!, JWT_SECRET!);
      req.headers.userData = decoded;
    } catch (err) {
      next(new HttpException(403, 'Token Inválido'));
    }
    next();
  };

  public checkAdmin = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {role} = req.headers.userData;
      if (role !== 'ADMIN') {
        throw new HttpException(403, 'Você não tem autorização');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  public checkSeller = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {role} = req.headers.userData;
      if (role !== 'ADMIN' && role !== 'SELLER') {
        throw new HttpException(403, 'Você não tem autorização');
      }
      next();
    } catch (err) {
      next(err);
    }
  };

  public sellerGetProducts = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const {role, id} = jwt.verify(token!, JWT_SECRET!) as any;
      if (role === 'SELLER') {
        req.headers.userData.id = id;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthMiddleware();
