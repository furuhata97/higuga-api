import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  search_word?: string;
  categoryId?: string;
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
  }: IRequest): Promise<Product[]> {
    if (search_word !== 'undefined' && categoryId !== 'undefined') {
      const products = await this.productsRepository.findBySearchAndCategoryField(
        { search_word: String(search_word), category_id: String(categoryId) },
      );

      return products;
    }

    if (categoryId !== 'undefined') {
      const products = await this.productsRepository.findByCategoryField(
        String(categoryId),
      );

      return products;
    }

    if (search_word !== 'undefined') {
      const products = await this.productsRepository.findBySearchField(
        String(search_word),
      );

      return products;
    }

    return [];
  }
}

export default SearchProductsService;
