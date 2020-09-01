import { uuid } from 'uuidv4';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IOrdersRepository from '../IOrdersRepository';
import Order from '../../infra/typeorm/entities/Order';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async create({
    payment_method,
    total,
    user,
    products,
    discount,
  }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, {
      id: uuid(),
      user,
      total,
      discount,
      order_products: products,
      payment_method,
      status: 'EM PROCESSAMENTO',
    });

    this.orders.push(order);

    return order;
  }
}

export default FakeOrdersRepository;
