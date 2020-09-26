import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';
import RefreshController from '../controllers/RefreshController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const sessionsRouter = Router();
const sessionsController = new SessionsController();
const refreshController = new RefreshController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionsRouter.get(
  '/check-token',
  ensureAuthenticated,
  sessionsController.index,
);

sessionsRouter.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

sessionsRouter.delete('/logout', sessionsController.delete);

sessionsRouter.post(
  '/token',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
    },
  }),
  refreshController.create,
);

export default sessionsRouter;
