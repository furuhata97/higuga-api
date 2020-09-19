import { getRepository, Repository, Raw } from 'typeorm';

import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import IGetCategoriesDTO from '@modules/products/dtos/IGetCategoriesDTO';
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

  public async save(category: Category): Promise<Category> {
    const saveCategory = await this.ormRepository.save(category);

    return saveCategory;
  }

  public async getAllCategories(): Promise<Category[]> {
    const categories = await this.ormRepository.find({
      order: {
        name: 'ASC',
      },
    });

    return categories;
  }

  public async getAllCategoriesAdmin({
    take,
    skip,
    search,
  }: IGetCategoriesDTO): Promise<[Category[], number]> {
    if (!search) {
      const categories = await this.ormRepository.findAndCount({
        take,
        skip,
        order: {
          name: 'ASC',
        },
      });

      return categories;
    }
    let searchName = search.toUpperCase();
    searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
    searchName = searchName.replace(/[ÈÉÊË]/, 'E');
    searchName = searchName.replace(/[ÚÙÛÜ]/, 'U');
    searchName = searchName.replace(/[ÕÓÒÔÖ]/, 'O');
    searchName = searchName.replace(/['Ç']/, 'C');

    const categories = await this.ormRepository.findAndCount({
      where: {
        name: Raw(
          nameField =>
            `${nameField} ILIKE '%${search}%' OR ${nameField} ILIKE '%${searchName}%'`,
        ),
      },
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return categories;
  }
}

export default CategoriesRepository;
