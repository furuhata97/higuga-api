import AppError from '@shared/errors/AppError';

import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoryService from './CreateCategoryService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategory: CreateCategoryService;

describe('CreateCategory', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    createCategory = new CreateCategoryService(fakeCategoriesRepository);
  });

  it('should be able to create a new category', async () => {
    const category = await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });

    expect(category).toHaveProperty('id');
  });

  it('shouldn`t be able to create two or more categories with the same name', async () => {
    await createCategory.execute({
      name: 'Drinks',
      is_admin: true,
    });

    await expect(
      createCategory.execute({
        name: 'Drinks',
        is_admin: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shouldn`t be able to create a new category without authorization', async () => {
    await expect(
      createCategory.execute({
        name: 'Drinks',
        is_admin: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
