import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IOrdersRepository from '../repositories/IOrdersRepository';
import IUsersRepository from '../../users/repositories/IUsersRepository';
import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  user_id: string;
}

@injectable()
class GetOrdersFromUserService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<Order[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const orders = await this.ordersRepository.getOrdersFromUser(user_id);

    return orders;
  }
}

export default GetOrdersFromUserService;
