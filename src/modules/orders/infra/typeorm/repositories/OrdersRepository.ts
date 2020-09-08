import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({
    user,
    products,
    payment_method,
    total,
    discount,
    zip_code,
    city,
    address,
  }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      user,
      order_products: products,
      payment_method,
      total,
      discount,
      status: 'EM PROCESSAMENTO',
      zip_code,
      city,
      address,
    });

    await this.ormRepository.save(order);

    return order;
  }

  public async getOrdersFromUser(user_id: string): Promise<Order[]> {
    const orders = this.ormRepository.find({
      where: {
        user_id,
      },
    });

    return orders;
  }

  // public async findById(id: string): Promise<Order | undefined> {
  //   const order = await this.ormRepository.findOne({ id });

  //   return order;
  // }
}

export default OrdersRepository;
