import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
// import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    barcode,
    stock,
    product_image,
    category_id,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      barcode,
      stock,
      product_image,
      category_id,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }

  // public async findAllById(products: IFindProducts[]): Promise<Product[]> {
  //   const ids = products.map(product => product.id);
  //   const foundProducts = await this.ormRepository.find({ id: In(ids) });

  //   if (ids.length !== foundProducts.length) {
  //     throw new AppError('One or more products do not exist');
  //   }

  //   return foundProducts;
  // }

  // public async updateQuantity(
  //   products: IUpdateProductsQuantityDTO[],
  // ): Promise<Product[]> {
  //   const foundProducts = await this.findAllById(products);
  //   const updateQuantity = foundProducts.map(product => {
  //     const foundProduct = products.find(
  //       fProduct => fProduct.id === product.id,
  //     );
  //     if (!foundProduct) {
  //       throw new AppError('Product not found');
  //     }

  //     if (product.quantity < foundProduct.quantity) {
  //       throw new AppError(
  //         `There are not enough quantity in stock for the product ${product.name}`,
  //       );
  //     }

  //     const productUpdated = product;
  //     productUpdated.quantity -= foundProduct.quantity;

  //     return productUpdated;
  //   });

  //   await this.ormRepository.save(updateQuantity);

  //   return updateQuantity;
  // }
}

export default ProductsRepository;
