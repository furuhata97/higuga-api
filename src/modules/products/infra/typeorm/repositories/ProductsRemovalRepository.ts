import { getMongoRepository, MongoRepository } from 'typeorm';

import IProductsRemovalRepository from '@modules/products/repositories/IProductsRemovalRepository';
import ICreateProductRemovalDTO from '@modules/products/dtos/ICreateProductRemovalDTO';

import {
  endOfDay,
  startOfDay,
  addHours,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import ProductRemoval from '../schemas/ProductRemoval';

class ProductsRemovalRepository implements IProductsRemovalRepository {
  private ormRepository: MongoRepository<ProductRemoval>;

  constructor() {
    this.ormRepository = getMongoRepository(ProductRemoval, 'mongo');
  }

  public async create({
    product_id,
    product_name,
    quantity_removed,
  }: ICreateProductRemovalDTO): Promise<ProductRemoval> {
    const productRemoval = this.ormRepository.create({
      product_name,
      product_id,
      quantity_removed,
    });

    await this.ormRepository.save(productRemoval);

    return productRemoval;
  }

  public async findByProductId(
    product_id: string,
  ): Promise<ProductRemoval | undefined> {
    const productRemoval = await this.ormRepository.findOne({
      where: { product_id },
    });

    return productRemoval;
  }

  public async findByDay(day: Date): Promise<ProductRemoval[]> {
    const startDate = startOfDay(day);
    const endDate = endOfDay(day);
    const productsRemoval = await this.ormRepository.find({
      where: {
        created_at: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });

    return productsRemoval;
  }

  public async findByWeek(day: Date): Promise<ProductRemoval[]> {
    const startDate = startOfWeek(day);
    const endDate = endOfWeek(day);
    const productsRemoval = await this.ormRepository.find({
      where: {
        created_at: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });

    return productsRemoval;
  }

  public async findByMonth(day: Date): Promise<ProductRemoval[]> {
    const startDate = startOfMonth(day);
    const endDate = endOfMonth(day);
    const productsRemoval = await this.ormRepository.find({
      where: {
        created_at: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });

    return productsRemoval;
  }
}

export default ProductsRemovalRepository;
