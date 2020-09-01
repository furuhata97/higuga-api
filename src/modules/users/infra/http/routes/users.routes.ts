import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import AddressesController from '../controllers/AddressesController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const addressesController = new AddressesController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
      zip_code: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
      phone_number: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.post(
  '/new-address',
  celebrate({
    [Segments.BODY]: {
      zip_code: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  addressesController.create,
);

usersRouter.put(
  '/profile',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  ensureAuthenticated,
  usersController.update,
);

usersRouter.put(
  '/update-address',
  celebrate({
    [Segments.BODY]: {
      address_id: Joi.string().required(),
      zip_code: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  addressesController.update,
);

usersRouter.delete(
  '/delete-address',
  celebrate({
    [Segments.BODY]: {
      address_id: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  addressesController.delete,
);

export default usersRouter;
