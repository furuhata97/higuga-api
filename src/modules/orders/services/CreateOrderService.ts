import { inject, injectable } from 'tsyringe';
import { startOfMonth, startOfWeek, startOfDay } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Order from '../infra/typeorm/entities/Order';

interface IProduct {
  product_id: string;
  quantity: number;
  price: number;
}

interface IRequest {
  user_id: string;
  products: IProduct[];
  discount?: number;
  payment_method: string;
  zip_code: string;
  city: string;
  address: string;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    products,
    discount,
    payment_method,
    zip_code,
    city,
    address,
  }: IRequest): Promise<Order> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const payment = payment_method.toUpperCase();
    const paymentWords = ['CARTAO', 'DINHEIRO', 'FIADO'];

    if (!paymentWords.includes(payment)) {
      throw new AppError('Invalid payment method');
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

    const order = await this.ordersRepository.create({
      user,
      products,
      payment_method,
      total,
      discount: realDiscount,
      zip_code,
      city,
      address,
    });

    productsUpdated.map(async product => {
      const updatedProduct = await this.productsRepository.save(product);
      return updatedProduct;
    });

    const startDay = startOfDay(new Date());
    const startWeek = startOfWeek(new Date());
    const startMonth = startOfMonth(new Date());

    await this.cacheProvider.invalidate(
      `orders-list:${JSON.stringify(startDay)}:day`,
    );

    await this.cacheProvider.invalidate(
      `orders-list:${JSON.stringify(startWeek)}:week`,
    );

    await this.cacheProvider.invalidate(
      `orders-list:${JSON.stringify(startMonth)}:month`,
    );

    return order;
  }
}

export default CreateOrderService;
