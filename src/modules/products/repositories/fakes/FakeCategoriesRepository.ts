import { uuid } from 'uuidv4';

import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';

import Category from '../../infra/typeorm/entities/Category';

class FakeCategoriesRepository implements ICategoriesRepository {
  private categories: Category[] = [];

  public async create(name: string): Promise<Category> {
    const category = new Category();

    Object.assign(category, { id: uuid(), name });

    this.categories.push(category);

    return category;
  }

  public async findById(id: string): Promise<Category | undefined> {
    const foundCategory = this.categories.find(category => category.id === id);

    return foundCategory;
  }

  public async findByName(name: string): Promise<Category | undefined> {
    const foundCategory = this.categories.find(
      category => category.name === name,
    );

    return foundCategory;
  }

  public async getAllCategories(): Promise<Category[]> {
    return this.categories;
  }
}

export default FakeCategoriesRepository;
