import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetFinishedSalesByDateService from '@modules/sales/services/GetFinishedSalesByDateService';

interface IRequestQuery {
  sale_date: Date;
  time: string;
}

export default class SalesFinishedByDateController {
  public async index(request: Request, response: Response): Promise<Response> {
    const date: IRequestQuery = request.query;
    const { is_admin } = request.user;

    const getFinishedSales = container.resolve(GetFinishedSalesByDateService);

    const sales = await getFinishedSales.execute({
      sale_date: date.sale_date,
      time: date.time,
      is_admin,
    });

    return response.json(classToClass(sales));
  }
}
