import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoryService from './CreateCategoryService';
import GetProductsService from './GetProductsService';

let fakeProductsRepository: FakeProductsRepository;
let createProducts: CreateProductService;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategory: CreateCategoryService;
let fakeStorageProvider: FakeStorageProvider;
let getProducts: GetProductsService;

describe('GetProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createProducts = new CreateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakeStorageProvider,
    );
    getProducts = new GetProductsService(fakeProductsRepository);
    createCategory = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to get all products', async () => {
    const category1 = await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });

    const category2 = await createCategory.execute({
      name: 'Sodas',
      is_admin: true,
    });

    await createProducts.execute({
      name: 'Vodka',
      category_id: category1.id,
      stock: 500,
      price: 15.32,
      barcode: '78945612345',
      is_admin: true,
    });

    await createProducts.execute({
      name: 'Coke',
      category_id: category2.id,
      stock: 410,
      price: 8.32,
      barcode: '789456122345',
      is_admin: true,
    });

    await createProducts.execute({
      name: 'Askov',
      category_id: category1.id,
      stock: 32,
      price: 15.0,
      barcode: '7894561742345',
      is_admin: true,
    });

    await createProducts.execute({
      name: 'Pepsi',
      category_id: category2.id,
      stock: 323,
      price: 17.5,
      barcode: '78945617842345',
      is_admin: true,
    });

    const products = await getProducts.execute();

    expect(products).toHaveLength(4);
  });
});
