import { getRepository, Repository } from 'typeorm';

import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';
import Category from '../entities/Category';

class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async create(name: string): Promise<Category> {
    const product = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Category | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findById(id: string): Promise<Category | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }
}

export default CategoriesRepository;
