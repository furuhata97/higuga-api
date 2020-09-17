import { inject, injectable } from 'tsyringe';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
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

    return this.ordersRepository.save(order);
  }
}

export default UpdateStatusService;
