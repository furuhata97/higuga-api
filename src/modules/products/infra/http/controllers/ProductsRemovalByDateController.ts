import { Request, Response } from 'express';

import { container } from 'tsyringe';
import FindProductsRemovalsByDateService from '@modules/products/services/FindProductsRemovalsByDateService';
import { classToClass } from 'class-transformer';
import AppError from '@shared/errors/AppError';

export default class ProductsRemovalByDateController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { date, type } = request.query;
    const { is_admin } = request.user;

    if (!date) {
      throw new AppError('Date invalid');
    }

    const productRemovalByDate = container.resolve(
      FindProductsRemovalsByDateService,
    );

    const productsRemoval = await productRemovalByDate.execute({
      date: new Date(String(date)),
      type: String(type),
      is_admin,
    });

    return response.json(classToClass(productsRemoval));
  }
}
