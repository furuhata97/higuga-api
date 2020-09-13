import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetUnfinishedService from '@modules/sales/services/GetUnfinishedService';

export default class SalesUnfinishedController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { is_admin } = request.user;

    const getUnfinishedSales = container.resolve(GetUnfinishedService);

    const sales = await getUnfinishedSales.execute({
      is_admin,
    });

    return response.json(classToClass(sales));
  }
}
