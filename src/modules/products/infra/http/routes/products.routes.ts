import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post(
  '/',
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
  ensureAuthenticated,
  productsController.create,
);

export default productsRouter;
