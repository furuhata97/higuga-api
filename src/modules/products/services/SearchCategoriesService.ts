import { inject, injectable } from 'tsyringe';

import Categories from '@modules/products/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';

interface IRequest {
  take: number;
  skip: number;
  search: string | undefined;
}

@injectable()
class SearchCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({
    take,
    skip,
    search,
  }: IRequest): Promise<[Categories[], number]> {
    const categories = await this.categoriesRepository.getAllCategoriesAdmin({
      take,
      skip,
      search: search || undefined,
    });

    return categories;
  }
}

export default SearchCategoriesService;
