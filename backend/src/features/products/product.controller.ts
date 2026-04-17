import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';
import {
  getProductsInputSchema,
  createProductSchema,
  updateProductSchema,
} from './product.validation';

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const input = getProductsInputSchema.parse(req.query);
      const result = await productService.getProducts(input);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createProductSchema.parse(req.body);
      const product = await productService.createProduct(input);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(req.params.id, input);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
