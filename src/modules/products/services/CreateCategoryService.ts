import { inject, injectable } from 'tsyringe';

import Category from '@modules/products/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  is_admin: boolean;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ name, is_admin }: IRequest): Promise<Category> {
    if (!is_admin) {
      throw new AppError('User does not have permission for this action');
    }

    const checkCategoryExists = await this.categoriesRepository.findByName(
      name,
    );

    if (checkCategoryExists) {
      throw new AppError('Category already exists');
    }

    const category = await this.categoriesRepository.create(name);

    return category;
  }
}

export default CreateCategoryService;
