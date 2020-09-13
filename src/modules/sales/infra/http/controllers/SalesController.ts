import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateSaleService from '@modules/sales/services/CreateSaleService';
import UpdateSaleService from '@modules/sales/services/UpdateSaleService';

export default class SalesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      client_name,
      products,
      discount,
      payment_method,
      money_received,
    } = request.body;
    const { is_admin } = request.user;

    const createSale = container.resolve(CreateSaleService);

    const sale = await createSale.execute({
      client_name,
      products,
      discount,
      payment_method,
      money_received,
      is_admin,
    });

    return response.json(classToClass(sale));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { sale_id, payment_method, money_received } = request.body;
    const { is_admin } = request.user;

    const updateSale = container.resolve(UpdateSaleService);

    const sale = await updateSale.execute({
      sale_id,
      payment_method,
      money_received,
      is_admin,
    });

    return response.json(classToClass(sale));
  }
}
