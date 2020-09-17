import { getRepository, Repository, Between } from 'typeorm';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addHours,
} from 'date-fns';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IGetOrdersDTO from '@modules/orders/dtos/IGetOrdersDTO';
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

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    return this.ormRepository.save(order);
  }

  public async getOrdersFromUser(user_id: string): Promise<Order[]> {
    const orders = await this.ormRepository.find({
      where: {
        user_id,
      },
    });

    return orders;
  }

  public async getOrdersByStatus({
    take,
    skip,
    status,
  }: IGetOrdersDTO): Promise<[Order[], number]> {
    const orders = await this.ormRepository.findAndCount({
      where: {
        status,
      },
      take,
      skip,
    });
    return orders;
  }

  public async getFinishedByDate(order_date: Date): Promise<Order[]> {
    const startDate = addHours(startOfDay(order_date), 3);
    const endDate = addHours(endOfDay(order_date), 3);

    const orders = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        updated_at: Between(startDate, endDate),
      },
    });

    return orders;
  }

  public async getFinishedByWeek(order_date: Date): Promise<Order[]> {
    const startDate = addHours(startOfWeek(order_date), 3);
    const endDate = addHours(endOfWeek(order_date), 3);

    const orders = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        updated_at: Between(startDate, endDate),
      },
    });

    return orders;
  }

  public async getFinishedByMonth(order_date: Date): Promise<Order[]> {
    const startDate = addHours(startOfMonth(order_date), 3);
    const endDate = addHours(endOfMonth(order_date), 3);

    const orders = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        updated_at: Between(startDate, endDate),
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
