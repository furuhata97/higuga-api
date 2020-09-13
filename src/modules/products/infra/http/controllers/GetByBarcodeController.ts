import { Request, Response } from 'express';

import { container } from 'tsyringe';
import GetProductByBarcodeService from '@modules/products/services/GetProductByBarcodeService';
import { classToClass } from 'class-transformer';

export default class SearchProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { barcode } = request.query;
    const { is_admin } = request.user;

    const getProductByBarcodeService = container.resolve(
      GetProductByBarcodeService,
    );

    const products = await getProductByBarcodeService.execute({
      barcode: String(barcode),
      is_admin,
    });

    return response.json(classToClass(products));
  }
}
