import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import OrdersController from '../controllers/OrdersController';
import OrdersFromUserController from '../controllers/OrdersFromUserController';
import GetOrdersByStatusController from '../controllers/GetOrdersByStatusController';
import UpdateStatusController from '../controllers/UpdateStatusController';
import OrdersFinishedByDateController from '../controllers/OrdersFinishedByDateController';

const ordersRouter = Router();
const ordersController = new OrdersController();
const ordersFromUserController = new OrdersFromUserController();
const getOrdersByStatusController = new GetOrdersByStatusController();
const updateStatusController = new UpdateStatusController();
const ordersFinishedByDateController = new OrdersFinishedByDateController();

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      discount: Joi.number(),
      payment_method: Joi.string().required(),
      zip_code: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
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

ordersRouter.get(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      take: Joi.number().required(),
      skip: Joi.number().required(),
      status: Joi.string().required(),
    },
  }),
  getOrdersByStatusController.index,
);

ordersRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      status: Joi.string().required(),
    },
  }),
  updateStatusController.update,
);

ordersRouter.get(
  '/finished-date',
  celebrate({
    [Segments.QUERY]: {
      order_date: Joi.date().required(),
      time: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  ordersFinishedByDateController.index,
);

export default ordersRouter;
