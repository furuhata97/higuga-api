import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

interface IRequest {
  take: number;
  skip: number;
  type: string;
}

@injectable()
class GetProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    take,
    skip,
    type,
  }: IRequest): Promise<[Product[], number]> {
    const products = await this.productsRepository.getAllProducts({
      take,
      skip,
      type,
    });

    return products;
  }
}

export default GetProductsService;
