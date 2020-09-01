import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';
import GetCategoriesService from '@modules/products/services/GetCategoriesService';

export default class CategoriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const { is_admin } = request.user;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({ name, is_admin });

    return response.json(category);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const getCategories = container.resolve(GetCategoriesService);
    const categories = await getCategories.execute();

    return response.json(categories);
  }
}
