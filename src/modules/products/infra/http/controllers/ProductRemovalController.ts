import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ProductRemovalService from '@modules/products/services/ProductRemovalService';
import { classToClass } from 'class-transformer';

export default class ProductRemovalController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { product_id, product_name, quantity_removed } = request.body;
    const { is_admin } = request.user;

    const productRemoval = container.resolve(ProductRemovalService);

    const product = await productRemoval.execute({
      product_id,
      product_name,
      quantity_removed,
      is_admin,
    });

    return response.json(classToClass(product));
  }
}
