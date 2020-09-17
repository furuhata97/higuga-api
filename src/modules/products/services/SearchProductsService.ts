import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  search_word?: string;
  categoryId?: string;
  take: number;
  skip: number;
  type: string;
}

@injectable()
class SearchProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    search_word,
    categoryId,
    take,
    skip,
    type,
  }: IRequest): Promise<[Product[], number]> {
    if (search_word !== 'undefined' && categoryId !== 'undefined') {
      const products = await this.productsRepository.findBySearchAndCategoryField(
        {
          search_word: String(search_word),
          category_id: String(categoryId),
          take,
          skip,
          type,
        },
      );

      return products;
    }

    if (categoryId !== 'undefined') {
      const products = await this.productsRepository.findByCategoryField({
        take,
        skip,
        type,
        search: String(categoryId),
      });

      return products;
    }

    if (search_word !== 'undefined') {
      const products = await this.productsRepository.findBySearchField({
        take,
        skip,
        type,
        search: String(search_word),
      });

      return products;
    }

    return [[], 0];
  }
}

export default SearchProductsService;
