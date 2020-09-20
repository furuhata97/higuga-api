import { inject, injectable } from 'tsyringe';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  order_date: Date;
  time: string;
  is_admin: boolean;
}

@injectable()
class GetFinishedOrdersByDateService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    order_date,
    time,
    is_admin,
  }: IRequest): Promise<Order[]> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    if (time === 'day') {
      const startDate = startOfDay(order_date);
      const cacheKey = `orders-list:${JSON.stringify(startDate)}:${time}`;

      let orders = await this.cacheProvider.recover<Order[]>(cacheKey);

      if (!orders || !orders.length) {
        orders = await this.ordersRepository.getFinishedByDate(order_date);

        await this.cacheProvider.save(cacheKey, classToClass(orders));
      }

      return orders;
    }

    if (time === 'week') {
      const startDate = startOfWeek(order_date);
      const cacheKey = `orders-list:${JSON.stringify(startDate)}:${time}`;

      let orders = await this.cacheProvider.recover<Order[]>(cacheKey);

      if (!orders || !orders.length) {
        orders = await this.ordersRepository.getFinishedByWeek(order_date);

        await this.cacheProvider.save(cacheKey, classToClass(orders));
      }

      return orders;
    }

    if (time === 'month') {
      const startDate = startOfMonth(order_date);
      const cacheKey = `orders-list:${JSON.stringify(startDate)}:${time}`;

      let orders = await this.cacheProvider.recover<Order[]>(cacheKey);

      if (!orders || !orders.length) {
        orders = await this.ordersRepository.getFinishedByMonth(order_date);

        await this.cacheProvider.save(cacheKey, classToClass(orders));
      }

      return orders;
    }

    throw new AppError('The time range can only be in day, week or month');
  }
}

export default GetFinishedOrdersByDateService;
