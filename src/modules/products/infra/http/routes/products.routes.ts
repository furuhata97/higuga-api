import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';
import SearchProductsController from '../controllers/SearchProductsController';
import SetHiddenProductController from '../controllers/SetHiddenProductController';
import GetByBarcodeController from '../controllers/GetByBarcodeController';
import ProductRemovalController from '../controllers/ProductRemovalController';
import ProductsRemovalByDateController from '../controllers/ProductsRemovalByDateController';

const productsRouter = Router();
const productsController = new ProductsController();
const searchProductsController = new SearchProductsController();
const setHiddenProductController = new SetHiddenProductController();
const getByBarcodeController = new GetByBarcodeController();
const productRemovalController = new ProductRemovalController();
const productsRemovalByDateController = new ProductsRemovalByDateController();

const upload = multer(uploadConfig.multer);

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

productsRouter.put(
  '/',
  ensureAuthenticated,
  upload.single('product_image'),
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      name: Joi.string().required(),
      barcode: Joi.string().required(),
      stock: Joi.number().required(),
      price: Joi.number().required(),
      category_id: Joi.string().required(),
    },
  }),

  productsController.update,
);

productsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      take: Joi.number().required(),
      skip: Joi.number().required(),
      type: Joi.string().required(),
    },
  }),
  productsController.index,
);

productsRouter.get(
  '/search',
  celebrate({
    [Segments.QUERY]: {
      search_word: Joi.string(),
      category_id: Joi.string(),
      take: Joi.number().required(),
      skip: Joi.number().required(),
      type: Joi.string().required(),
    },
  }),
  searchProductsController.index,
);

productsRouter.get(
  '/barcode',
  ensureAuthenticated,
  getByBarcodeController.index,
);

productsRouter.patch(
  '/hidden',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
    },
  }),
  setHiddenProductController.update,
);

productsRouter.patch(
  '/removal-quantity',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      product_id: Joi.string().required(),
      product_name: Joi.string().required(),
      quantity_removed: Joi.number().required(),
    },
  }),
  productRemovalController.update,
);

productsRouter.get(
  '/removal-quantity',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      date: Joi.date().required(),
      type: Joi.string().required(),
    },
  }),
  productsRemovalByDateController.index,
);

export default productsRouter;
