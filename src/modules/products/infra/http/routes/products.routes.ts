import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';
import SearchProductsController from '../controllers/SearchProductsController';

const productsRouter = Router();
const productsController = new ProductsController();
const searchProductsController = new SearchProductsController();
const upload = multer(uploadConfig);

productsRouter.post(
  '/',
  ensureAuthenticated,
  upload.single('product_image'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      barcode: Joi.string().required(),
      stock: Joi.number().required(),
      price: Joi.number().required(),
      product_image: Joi.string(),
      category_id: Joi.string().required(),
    },
  }),
  productsController.create,
);

productsRouter.get('/', productsController.index);

productsRouter.get('/search', searchProductsController.index);

export default productsRouter;
