import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IProductsRemovalRepository from '@modules/products/repositories/IProductsRemovalRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  product_id: string;
  product_name: string;
  quantity_removed: number;
  is_admin: boolean;
}

@injectable()
class ProductsRemovalService {
  constructor(
    @inject('ProductsRemovalRepository')
    private productsRemovalRepository: IProductsRemovalRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    product_id,
    product_name,
    quantity_removed,
    is_admin,
  }: IRequest): Promise<Product> {
    if (!is_admin) {
      throw new AppError('User does not have permission for this action');
    }

    const product = await this.productsRepository.findById(product_id);
    if (!product) {
      throw new AppError('The informed product does not exists');
    }

    if (product.name !== product_name) {
      throw new AppError('The informed id and name does not match');
    }

    if (product.stock < quantity_removed) {
      throw new AppError('The stcok is lesser than the quantity to remove');
    }

    product.stock -= quantity_removed;

    await this.productsRepository.save(product);

    await this.productsRemovalRepository.create({
      product_id,
      product_name,
      quantity_removed,
    });

    return product;
  }
}

export default ProductsRemovalService;
