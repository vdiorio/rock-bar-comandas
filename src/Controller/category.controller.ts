import {NextFunction, Request, Response} from 'express';
import categoryService from '../Services/category.service';

class ProductController {
  private service;

  constructor() {
    this.service = categoryService;
  }

  public getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.service.getCategories();
      return res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  };

  public createCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const created = await this.service.createCategory(data);
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.params;
      const created = await this.service.deleteCategory(Number(id));
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();
