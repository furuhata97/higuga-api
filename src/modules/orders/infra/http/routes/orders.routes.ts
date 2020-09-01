import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import OrdersController from '../controllers/OrdersController';
import OrdersFromUserController from '../controllers/OrdersFromUserController';

const ordersRouter = Router();
const ordersController = new OrdersController();
const ordersFromUserController = new OrdersFromUserController();

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      discount: Joi.number(),
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
  ordersController.create,
);

ordersRouter.get(
  '/my-orders',
  ensureAuthenticated,
  ordersFromUserController.index,
);

export default ordersRouter;
