import Order from '../infra/typeorm/entities/Order';

import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import IGetOrdersDTO from '../dtos/IGetOrdersDTO';

export default interface IOrdersRepository {
  create(data: ICreateOrderDTO): Promise<Order>;
  findById(id: string): Promise<Order | undefined>;
  save(order: Order): Promise<Order>;
  getOrdersFromUser(user_id: string): Promise<Order[]>;
  getOrdersByStatus(data: IGetOrdersDTO): Promise<[Order[], number]>;
  getFinishedByDate(order_date: Date): Promise<Order[]>;
  getFinishedByWeek(order_date: Date): Promise<Order[]>;
  getFinishedByMonth(order_date: Date): Promise<Order[]>;
}
