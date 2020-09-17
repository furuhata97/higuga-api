import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetOrdersByStatusService from '@modules/orders/services/GetOrdersByStatusService';

export default class GetOrdersByStatusController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { take, skip, status } = request.query;
    const { is_admin } = request.user;

    const getOrders = container.resolve(GetOrdersByStatusService);

    const orders = await getOrders.execute({
      take: Number(take),
      skip: Number(skip),
      status: String(status),
      is_admin,
    });

    return response.json(classToClass(orders));
  }
}
