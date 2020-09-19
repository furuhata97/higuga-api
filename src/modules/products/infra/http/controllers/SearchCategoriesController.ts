import { Request, Response } from 'express';

import { container } from 'tsyringe';
import SearchCategoriesService from '@modules/products/services/SearchCategoriesService';
import { classToClass } from 'class-transformer';

export default class SearchCategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { search, take, skip } = request.query;

    const searchCategoriesService = container.resolve(SearchCategoriesService);

    const products = await searchCategoriesService.execute({
      search: search ? String(search) : undefined,
      skip: Number(skip),
      take: Number(take),
    });

    return response.json(classToClass(products));
  }
}
