import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  barcode: string;
  is_admin: boolean;
}

@injectable()
class GetProductByBarcodeService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ barcode, is_admin }: IRequest): Promise<Product> {
    if (!is_admin) {
      throw new AppError('User does not have permission for this action');
    }

    const product = await this.productsRepository.findByBarcode(barcode);

    if (!product) {
      throw new AppError('Product not found');
    }

    return product;
  }
}

export default GetProductByBarcodeService;
