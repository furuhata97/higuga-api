import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetFinishedOrdersByDateService from '@modules/orders/services/GetFinishedOrdersByDateService';

interface IRequestQuery {
  order_date: Date;
  time: string;
}

export default class OrdersFinishedByDateController {
  public async index(request: Request, response: Response): Promise<Response> {
    const date: IRequestQuery = request.query;
    const { is_admin } = request.user;

    const getFinishedOrders = container.resolve(GetFinishedOrdersByDateService);

    const orders = await getFinishedOrders.execute({
      order_date: date.order_date,
      time: date.time,
      is_admin,
    });

    return response.json(classToClass(orders));
  }
}
