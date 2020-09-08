import { Request, Response } from 'express';

import { container } from 'tsyringe';
import SetHiddenService from '@modules/products/services/SetHiddenService';
import { classToClass } from 'class-transformer';

export default class ProductsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const { is_admin } = request.user;

    const setHidden = container.resolve(SetHiddenService);

    const product = await setHidden.execute({
      id,
      is_admin,
    });

    return response.json(classToClass(product));
  }
}
