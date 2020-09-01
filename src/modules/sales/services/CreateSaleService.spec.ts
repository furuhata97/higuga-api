import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import FakeCategoriesRepository from '@modules/products/repositories/fakes/FakeCategoriesRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import CreateSaleService from './CreateSaleService';
import FakeSalesRepository from '../repositories/fakes/FakeSalesRepository';

let fakeProductsRepository: FakeProductsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeSalesRepository: FakeSalesRepository;
let createSaleService: CreateSaleService;
let createProductService: CreateProductService;
let createCategoryService: CreateCategoryService;
let fakeStorageProvider: FakeStorageProvider;

describe('CreateSale', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeSalesRepository = new FakeSalesRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createSaleService = new CreateSaleService(
      fakeSalesRepository,
      fakeProductsRepository,
    );
    createProductService = new CreateProductService(
      fakeProductsRepository,
      fakeCategoriesRepository,
      fakeStorageProvider,
    );
    createCategoryService = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to create a new sale', async () => {
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

    const sale = await createSaleService.execute({
      client_name: 'John Doe',
      payment_method: 'CARTAO',
      discount: 5,
      is_admin: true,
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

    expect(sale).toHaveProperty('id');
  });

  it('should be able to create a new order without informed discount', async () => {
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

    const sale = await createSaleService.execute({
      client_name: 'John Doe',
      payment_method: 'CARTAO',
      is_admin: true,
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

    expect(sale).toHaveProperty('id');
  });

  // it('should not be able to create a new sale without client name', async () => {
  //   const category = await createCategoryService.execute({
  //     name: 'Soda',
  //     is_admin: true,
  //   });

  //   const product1 = await createProductService.execute({
  //     name: 'Coca-Cola',
  //     barcode: '789456123',
  //     price: 8.5,
  //     stock: 40,
  //     category_id: category.id,
  //     is_admin: true,
  //   });

  //   const product2 = await createProductService.execute({
  //     name: 'Pepsi',
  //     barcode: '789456163',
  //     price: 7.5,
  //     stock: 65,
  //     category_id: category.id,
  //     is_admin: true,
  //   });

  //   await expect(
  //     createSaleService.execute({
  //       payment_method: 'CARTAO',
  //       discount: 5,
  //       products: [
  //         {
  //           product_id: product1.id,
  //           price: product1.price,
  //           quantity: product1.stock,
  //         },
  //         {
  //           product_id: product2.id,
  //           price: product2.price,
  //           quantity: product2.stock,
  //         },
  //       ],
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });

  it('should not be able to create a new sale with invalid payment method', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARD',
        discount: 5,
        is_admin: true,
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

  it('should not be able to create a new sale with invalid quantity', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARTAO',
        is_admin: true,
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

  it('should not be able to create a new sale with invalid price', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARTAO',
        is_admin: true,
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

  it('should not be able to create a new sale with invalid product', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARTAO',
        is_admin: true,
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

  it('should not be able to create a new sale without authorization', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARTAO',
        is_admin: false,
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

  it('should not be able to create a new sale with money payment and without money received', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'DINHEIRO',
        discount: 5,
        is_admin: true,
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

  it('should not be able to create a new sale with money received and payment method different from money', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'CARTAO',
        discount: 5,
        money_received: 350.4,
        is_admin: true,
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

  it('should not be able to create a new sale with money received less than total amount', async () => {
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
      createSaleService.execute({
        client_name: 'John Doe',
        payment_method: 'DINHEIRO',
        money_received: 15.99,
        is_admin: true,
        products: [
          {
            product_id: product1.id,
            price: product1.price,
            quantity: 1,
          },
          {
            product_id: product2.id,
            price: product2.price,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a new sale with change', async () => {
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

    const sale = await createSaleService.execute({
      client_name: 'John Doe',
      payment_method: 'DINHEIRO',
      money_received: 17,
      is_admin: true,
      products: [
        {
          product_id: product1.id,
          price: product1.price,
          quantity: 1,
        },
        {
          product_id: product2.id,
          price: product2.price,
          quantity: 1,
        },
      ],
    });

    expect(sale).toHaveProperty('id');
  });
});
