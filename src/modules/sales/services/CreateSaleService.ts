import { inject, injectable } from 'tsyringe';
import { startOfMonth, startOfWeek, startOfDay } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISalesRepository from '../repositories/ISalesRepository';
import Sale from '../infra/typeorm/entities/Sale';

interface IProduct {
  product_id: string;
  quantity: number;
  price: number;
}

interface IRequest {
  client_name: string;
  products: IProduct[];
  discount?: number;
  payment_method: string;
  is_admin: boolean;
  money_received?: number;
}

@injectable()
class CreateSaleService {
  constructor(
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    client_name,
    products,
    discount,
    payment_method,
    money_received,
    is_admin,
  }: IRequest): Promise<Sale> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    const payment = payment_method.toUpperCase();
    const paymentWords = ['CARTAO', 'DINHEIRO', 'FIADO'];

    if (!paymentWords.includes(payment)) {
      throw new AppError('Invalid payment method');
    }

    if (payment === 'DINHEIRO' && !money_received) {
      throw new AppError(
        'It is needed to inform the amount in money you received',
      );
    }

    if (money_received && payment !== 'DINHEIRO') {
      throw new AppError(
        'You can only receive money if the payment method is in money',
      );
    }

    const products_ids = products.map(product => product.product_id);

    const foundProducts = await this.productsRepository.findAllById(
      products_ids,
    );

    const productsUpdated = foundProducts.map(f_product => {
      const product = products.find(p => p.product_id === f_product.id);

      if (!product) {
        throw new AppError('Product not found');
      }

      if (f_product.stock < product.quantity) {
        throw new AppError(
          `The request amount of ${f_product.name} is greater than available in stock`,
        );
      }

      if (Number(f_product.price) !== product.price) {
        throw new AppError('The informed price is inconsistent');
      }

      const productWithStockUpdated = f_product;

      productWithStockUpdated.stock -= product.quantity;

      return productWithStockUpdated;
    });

    const setOfPrices = products.map(product => {
      const realPrice = product.price * product.quantity;
      return realPrice;
    });

    const subtotal = setOfPrices.reduce((a, b) => a + b, 0);

    const realDiscount = discount || 0;

    const total = subtotal - realDiscount;

    if (money_received && money_received < total) {
      throw new AppError(
        'The total value is higher than the informed received value',
      );
    }

    const received = money_received || 0;

    let change = 0;

    if (money_received && money_received > total) {
      change = money_received - total;
    }

    const sale = await this.salesRepository.create({
      client_name,
      products,
      payment_method: payment,
      total,
      discount: realDiscount,
      money_received: received,
      change,
    });

    productsUpdated.map(async product => {
      const updatedProduct = await this.productsRepository.save(product);
      return updatedProduct;
    });

    const startDay = startOfDay(new Date());
    const startWeek = startOfWeek(new Date());
    const startMonth = startOfMonth(new Date());

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startDay)}:day`,
    );

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startWeek)}:week`,
    );

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startMonth)}:month`,
    );

    return sale;
  }
}

export default CreateSaleService;
