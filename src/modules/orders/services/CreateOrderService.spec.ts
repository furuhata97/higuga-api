import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import FakeCategoriesRepository from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateOrderService from './CreateOrderService';
import FakeOrdersRepository from '../repositories/fakes/FakeOrdersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let createOrderService: CreateOrderService;
let createUserService: CreateUserService;
let createProductService: CreateProductService;
let createCategoryService: CreateCategoryService;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();
    createOrderService = new CreateOrderService(
      fakeOrdersRepository,
      fakeUsersRepository,
      fakeProductsRepository,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createProductService = new CreateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakeStorageProvider,
    );
    createCategoryService = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to create a new order', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    const order = await createOrderService.execute({
      user_id: user.id,
      payment_method: 'CARTAO',
      discount: 5,
      products: [
        {
          product_id: product1.id,
          price: product1.price,
          quantity: product1.stock,
        },
        {
          product_id: product2.id,
          price: product2.price,
          quantity: product2.stock,
        },
      ],
    });

    expect(order).toHaveProperty('id');
  });

  it('should be able to create a new order without informed discount', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    const order = await createOrderService.execute({
      user_id: user.id,
      payment_method: 'CARTAO',
      products: [
        {
          product_id: product1.id,
          price: product1.price,
          quantity: product1.stock,
        },
        {
          product_id: product2.id,
          price: product2.price,
          quantity: product2.stock,
        },
      ],
    });

    expect(order).toHaveProperty('id');
  });

  it('should not be able to create a new order with invalid user id', async () => {
    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    await expect(
      createOrderService.execute({
        user_id: 'fake-user-id',
        payment_method: 'CARTAO',
        discount: 5,
        products: [
          {
            product_id: product1.id,
            price: product1.price,
            quantity: product1.stock,
          },
          {
            product_id: product2.id,
            price: product2.price,
            quantity: product2.stock,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order with invalid payment method', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    await expect(
      createOrderService.execute({
        user_id: user.id,
        payment_method: 'CARD',
        discount: 5,
        products: [
          {
            product_id: product1.id,
            price: product1.price,
            quantity: product1.stock,
          },
          {
            product_id: product2.id,
            price: product2.price,
            quantity: product2.stock,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order with invalid quantity', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    await expect(
      createOrderService.execute({
        user_id: user.id,
        payment_method: 'CARTAO',
        products: [
          {
            product_id: product1.id,
            price: product1.price,
            quantity: 100,
          },
          {
            product_id: product2.id,
            price: product2.price,
            quantity: product2.stock,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order with invalid price', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    const product2 = await createProductService.execute({
      name: 'Pepsi',
      barcode: '789456163',
      price: 7.5,
      stock: 65,
      category_id: category.id,
      is_admin: true,
    });

    await expect(
      createOrderService.execute({
        user_id: user.id,
        payment_method: 'CARTAO',
        products: [
          {
            product_id: product1.id,
            price: 120.5,
            quantity: product1.stock,
          },
          {
            product_id: product2.id,
            price: product2.price,
            quantity: product2.stock,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new order with invalid product', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '80610290',
      city: 'Example',
      address: 'Example Street',
      phone_number: '5544778899',
    });

    const category = await createCategoryService.execute({
      name: 'Soda',
      is_admin: true,
    });

    const product1 = await createProductService.execute({
      name: 'Coca-Cola',
      barcode: '789456123',
      price: 8.5,
      stock: 40,
      category_id: category.id,
      is_admin: true,
    });

    await expect(
      createOrderService.execute({
        user_id: user.id,
        payment_method: 'CARTAO',
        products: [
          {
            product_id: product1.id,
            price: product1.price,
            quantity: 2,
          },
          {
            product_id: 'fake-product-id',
            price: 7,
            quantity: 20,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
