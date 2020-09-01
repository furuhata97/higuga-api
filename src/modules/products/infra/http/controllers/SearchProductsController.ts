import { Request, Response } from 'express';

import { container } from 'tsyringe';
import SearchProductsService from '@modules/products/services/SearchProductsService';
import { classToClass } from 'class-transformer';

export default class SearchProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search_word, category_id } = request.query;

    const searchProductsService = container.resolve(SearchProductsService);

    const products = await searchProductsService.execute({
      search_word: String(search_word),
      categoryId: String(category_id),
    });

    return response.json(classToClass(products));
  }
}
