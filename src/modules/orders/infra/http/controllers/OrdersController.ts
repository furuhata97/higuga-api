import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateOrderService from '@modules/orders/services/CreateOrderService';

export default class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { products, discount, payment_method } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      user_id: id,
      products,
      discount,
      payment_method,
    });

    return response.json(classToClass(order));
  }
}
