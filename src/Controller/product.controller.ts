import {NextFunction, Request, Response} from 'express';
import productsService from '../Services/products.service';
import Iproduct from '../Interfaces/Iproduct';

class ProductController {
  private service;

  constructor() {
    this.service = productsService;
  }

  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {name, price, photo} = req.body;
      const product = await this.service.createProduct(
        name,
        Number(price),
        photo,
      );
      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  public getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {sellerId} = req.params;
      const products = await this.service.findProducts(Number(sellerId));
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    try {
      const product = await this.service.findById(Number(id));
      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const product = req.body as Iproduct;
      const {id} = req.params;
      const updatedProduct = await this.service.updateProduct(
        Number(id),
        product,
      );
      return res.status(200).json(updatedProduct);
    } catch (err) {
      next(err);
    }
  };

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      console.log(id);
      const deleted = await this.service.deleteProduct(id);
      return res.status(201).json(deleted);
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();
