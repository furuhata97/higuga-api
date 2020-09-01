import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoryService from './CreateCategoryService';
import SearchProductsService from './SearchProductsService';

let fakeProductsRepository: FakeProductsRepository;
let createProducts: CreateProductService;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategory: CreateCategoryService;
let fakeStorageProvider: FakeStorageProvider;
let searchProducts: SearchProductsService;

describe('SearchProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createProducts = new CreateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakeStorageProvider,
    );
    searchProducts = new SearchProductsService(fakeProductsRepository);
    createCategory = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to search all products by search word', async () => {
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
      name: 'Plotka',
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

    const products = await searchProducts.execute({
      search_word: 'ka',
      categoryId: 'undefined',
    });

    expect(products).toHaveLength(2);
  });

  it('should be able to search all products by category', async () => {
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
      name: 'Plotka',
      category_id: category1.id,
      stock: 32,
      price: 15.0,
      barcode: '7894561742345',
      is_admin: true,
    });

    const products = await searchProducts.execute({
      search_word: 'undefined',
      categoryId: category1.id,
    });

    expect(products).toHaveLength(2);
  });

  it('should be able to search all products by category and search word', async () => {
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
      name: 'Plotka',
      category_id: category1.id,
      stock: 32,
      price: 15.0,
      barcode: '7894561742345',
      is_admin: true,
    });

    const products = await searchProducts.execute({
      search_word: 'Vo',
      categoryId: category1.id,
    });

    expect(products).toHaveLength(1);
  });

  it('should an empty array if no search word or category is provided', async () => {
    const products = await searchProducts.execute({
      search_word: 'undefined',
      categoryId: 'undefined',
    });

    expect(products).toHaveLength(0);
  });
});
