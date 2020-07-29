import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      barcode,
      stock,
      price,
      product_image,
      category_id,
    } = request.body;
    const { is_admin } = request.user;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      barcode,
      stock,
      price,
      product_image,
      category_id,
      is_admin,
    });

    return response.json(product);
  }
}
