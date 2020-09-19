import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CategoriesController from '../controllers/CategoriesController';
import SearchCategoriesController from '../controllers/SearchCategoriesController';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();
const searchCategoriesController = new SearchCategoriesController();

categoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  categoriesController.create,
);

categoriesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      name: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  categoriesController.update,
);

categoriesRouter.get('/', categoriesController.index);

categoriesRouter.get(
  '/search',
  celebrate({
    [Segments.QUERY]: {
      search: Joi.string(),
      take: Joi.number().required(),
      skip: Joi.number().required(),
    },
  }),
  searchCategoriesController.index,
);

export default categoriesRouter;
