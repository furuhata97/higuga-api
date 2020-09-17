import { getMongoRepository, MongoRepository } from 'typeorm';

import IProductsRemovalRepository from '@modules/products/repositories/IProductsRemovalRepository';
import ICreateProductRemovalDTO from '@modules/products/dtos/ICreateProductRemovalDTO';

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
}

export default ProductsRemovalRepository;
