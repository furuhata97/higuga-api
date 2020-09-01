import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import SalesController from '../controllers/SalesController';

const salesRouter = Router();
const salesController = new SalesController();

salesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      client_name: Joi.string().required(),
      discount: Joi.number(),
      money_received: Joi.number(),
      payment_method: Joi.string().required(),
      products: Joi.array()
        .items(
          Joi.object()
            .keys({
              product_id: Joi.string().required(),
              price: Joi.number().required(),
              quantity: Joi.number().required(),
            })
            .required(),
        )
        .required(),
    },
  }),
  ensureAuthenticated,
  salesController.create,
);

export default salesRouter;
