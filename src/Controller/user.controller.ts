import {NextFunction, Request, Response} from 'express';
import userService from '../Services/user.service';
import IcustomRequest from '../Interfaces/IcustomHeader';
import Iuser from '../Interfaces/Iuser';

class CommandController {
  private service;

  constructor() {
    this.service = userService;
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, password} = req.body;
      const logged = await this.service.authUser(email, password);
      return res.status(200).json(logged);
    } catch (err) {
      next(err);
    }
  };

  public validate = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const {role} = req.headers.userData;
    return res.status(200).json({role});
  };

  public getUsersByRole = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {role} = req.params;
      const users = await this.service.getUsersByRole(role.toUpperCase());
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  public createUser = async (
    req: IcustomRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.body;
      const created: Partial<Iuser> = await this.service.createUser(user);
      delete created.password;
      return res.status(200).json(created);
    } catch (err) {
      next(err);
    }
  };

  public adminResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {password} = req.body;
      const {id} = req.params;
      await this.service.resetPassword(Number(id), password);
      return res.status(201).json({message: 'Senha resetada'});
    } catch (err) {
      next(err);
    }
  };

  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const id = req.params.id;
      const updated = await this.service.updateUser(Number(id), data);
      return res.status(200).json(updated.categoryId);
    } catch (err) {
      next(err);
    }
  };
}

export default new CommandController();
