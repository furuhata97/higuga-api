import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateCategoryService from '@modules/products/services/CreateCategoryService';

export default class CategoriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;
    const { is_admin } = request.user;

    const createCategory = container.resolve(CreateCategoryService);

    const category = await createCategory.execute({ name, is_admin });

    return response.json(category);
  }
}
