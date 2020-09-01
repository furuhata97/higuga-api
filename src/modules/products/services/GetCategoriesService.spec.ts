import AppError from '@shared/errors/AppError';

import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoyService from './CreateCategoryService';
import GetCategoriesService from './GetCategoriesService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let getCategories: GetCategoriesService;
let createCategory: CreateCategoyService;

describe('GetCategories', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    createCategory = new CreateCategoyService(fakeCategoriesRepository);
    getCategories = new GetCategoriesService(fakeCategoriesRepository);
  });

  it('should be able to get categories', async () => {
    await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });

    await createCategory.execute({
      name: 'Sodas',
      is_admin: true,
    });

    await createCategory.execute({
      name: 'Beers',
      is_admin: true,
    });

    const categories = await getCategories.execute();

    expect(categories).toHaveLength(3);
  });
});
