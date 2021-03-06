import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import CategoriesRepository from '@modules/products/infra/typeorm/repositories/CategoriesRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

import ISalesRepository from '@modules/sales/repositories/ISalesRepository';
import SalesRepository from '@modules/sales/infra/typeorm/repositories/SalesRepository';

import IProductsRemovalRepository from '@modules/products/repositories/IProductsRemovalRepository';
import ProductsRemovalRepository from '@modules/products/infra/typeorm/repositories/ProductsRemovalRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IProductsRemovalRepository>(
  'ProductsRemovalRepository',
  ProductsRemovalRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<ISalesRepository>(
  'SalesRepository',
  SalesRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
