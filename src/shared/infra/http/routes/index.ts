import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import categoriesRouter from '@modules/products/infra/http/routes/categories.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';
import salesRouter from '@modules/sales/infra/http/routes/sales.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/products', productsRouter);
routes.use('/categories', categoriesRouter);
routes.use('/password', passwordRouter);
routes.use('/orders', ordersRouter);
routes.use('/sales', salesRouter);

export default routes;
