import { inject, injectable } from 'tsyringe';
import { startOfMonth, startOfWeek, startOfDay } from 'date-fns';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  status: string;
  id: string;
  is_admin: boolean;
}

@injectable()
class UpdateStatusService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ status, id, is_admin }: IRequest): Promise<Order> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    const statusType = status.toUpperCase();
    const statusWords = [
      'FINALIZADO',
      'CANCELADO',
      'EM PROCESSAMENTO',
      'EM TRANSITO',
    ];

    if (!statusWords.includes(statusType)) {
      throw new AppError('Invalid status');
    }

    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Product not found!');
    }

    if (statusType === order.status) {
      throw new AppError('The provided status is the same in the order');
    }

    if (order.status === 'FINALIZADO' || order.status === 'CANCELADO') {
      throw new AppError(
        'You cannot change the status of a finished or canceled order',
      );
    }

    order.status = statusType;

    const updatedOrder = await this.ordersRepository.save(order);

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

    return updatedOrder;
  }
}

export default UpdateStatusService;
