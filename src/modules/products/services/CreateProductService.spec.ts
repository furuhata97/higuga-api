import AppError from '@shared/errors/AppError';

import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';
import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoryService from './CreateCategoryService';

let fakeProductsRepository: FakeProductsRepository;
let createProducts: CreateProductService;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategory: CreateCategoryService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    createProducts = new CreateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
    );
    createCategory = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to create a new product', async () => {
    const category = await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });
    const product = await createProducts.execute({
      name: 'Vodka',
      category_id: category.id,
      stock: 500,
      price: 15.32,
      barcode: '78945612345',
      is_admin: true,
    });

    expect(product).toHaveProperty('id');
  });

  it('shouldn`t be able to create two or more products with the same name', async () => {
    const category = await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });
    await createProducts.execute({
      name: 'Vodka',
      category_id: category.id,
      stock: 500,
      price: 15.32,
      barcode: '78945612345',
      is_admin: true,
    });

    await expect(
      createProducts.execute({
        name: 'Vodka',
        category_id: category.id,
        stock: 500,
        price: 15.32,
        barcode: '78945612345',
        is_admin: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shouldn`t be able to create a new product with an invalid category', async () => {
    await expect(
      createProducts.execute({
        name: 'Vodka',
        category_id: 'fake_category.id',
        stock: 500,
        price: 15.32,
        barcode: '78945612345',
        is_admin: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shouldn`t be able to create a new product without authorization', async () => {
    const category = await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });

    await expect(
      createProducts.execute({
        name: 'Vodka',
        category_id: category.id,
        stock: 500,
        price: 15.32,
        barcode: '78945612345',
        is_admin: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
