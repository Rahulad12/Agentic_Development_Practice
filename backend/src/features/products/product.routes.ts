import { Router } from 'express';
import { productController } from './product.controller';

export const productRoutes = Router();

productRoutes.get('/', (req, res, next) =>
  productController.getProducts(req, res, next)
);

productRoutes.get('/:id', (req, res, next) =>
  productController.getProduct(req, res, next)
);

productRoutes.post('/', (req, res, next) =>
  productController.createProduct(req, res, next)
);

productRoutes.put('/:id', (req, res, next) =>
  productController.updateProduct(req, res, next)
);

productRoutes.delete('/:id', (req, res, next) =>
  productController.deleteProduct(req, res, next)
);
