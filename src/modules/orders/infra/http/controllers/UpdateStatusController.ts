import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateStatusService from '@modules/orders/services/UpdateStatusService';

export default class UpdateStatusController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id, status } = request.body;
    const { is_admin } = request.user;

    const updateOrder = container.resolve(UpdateStatusService);

    const order = await updateOrder.execute({
      id: String(id),
      status: String(status),
      is_admin,
    });

    return response.json(classToClass(order));
  }
}
