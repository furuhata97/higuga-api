import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import SalesController from '../controllers/SalesController';
import SalesFinishedByDateController from '../controllers/SalesFinishedByDateController';
import SalesUnfinishedController from '../controllers/SalesUnfinishedController';

const salesRouter = Router();
const salesController = new SalesController();
const salesFinishedByDateController = new SalesFinishedByDateController();
const salesUnfinishedController = new SalesUnfinishedController();

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

salesRouter.get(
  '/finished-date',
  celebrate({
    [Segments.QUERY]: {
      sale_date: Joi.date().required(),
      time: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  salesFinishedByDateController.index,
);

salesRouter.get(
  '/unfinished',
  ensureAuthenticated,
  salesUnfinishedController.index,
);

salesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      sale_id: Joi.string().required(),
      payment_method: Joi.string().required(),
      money_received: Joi.number(),
    },
  }),
  ensureAuthenticated,
  salesController.update,
);

export default salesRouter;
