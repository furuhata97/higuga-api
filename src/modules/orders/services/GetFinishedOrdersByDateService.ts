import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
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
      const orders = this.ordersRepository.getFinishedByDate(order_date);

      return orders;
    }

    if (time === 'week') {
      const orders = this.ordersRepository.getFinishedByWeek(order_date);

      return orders;
    }

    if (time === 'month') {
      const orders = this.ordersRepository.getFinishedByMonth(order_date);

      return orders;
    }

    throw new AppError('The time range can only be in day, week or month');
  }
}

export default GetFinishedOrdersByDateService;
