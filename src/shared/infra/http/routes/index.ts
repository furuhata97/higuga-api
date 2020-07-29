import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import categoriesRouter from '@modules/products/infra/http/routes/categories.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/products', productsRouter);
routes.use('/categories', categoriesRouter);

export default routes;
