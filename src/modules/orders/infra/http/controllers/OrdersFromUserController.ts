import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetOrderFromUserService from '@modules/orders/services/GetOrderFromUserService';

export default class OrdersFromUserController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const getOrders = container.resolve(GetOrderFromUserService);

    const orders = await getOrders.execute(id);

    return response.json(classToClass(orders));
  }
}
