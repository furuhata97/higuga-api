import { inject, injectable } from 'tsyringe';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  take: number;
  skip: number;
  status: string;
  is_admin: boolean;
}

@injectable()
class GetOrdersByStatusService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({
    take,
    skip,
    status,
    is_admin,
  }: IRequest): Promise<[Order[], number]> {
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
      throw new AppError('Invalid payment method');
    }

    const orders = await this.ordersRepository.getOrdersByStatus({
      take,
      skip,
      status: statusType,
    });

    return orders;
  }
}

export default GetOrdersByStatusService;
