import { inject, injectable } from 'tsyringe';

import Category from '@modules/products/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';

@injectable()
class GetCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.getAllCategories();

    // if (categories.length === 0) {
    //   throw new AppError('None Category found');
    // }

    return categories;
  }
}

export default GetCategoriesService;
