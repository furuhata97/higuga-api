import { uuid } from 'uuidv4';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';

import Product from '../../infra/typeorm/entities/Product';

class FakeProductRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create({
    stock,
    price,
    name,
    barcode,
    category_id,
    product_image,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id: uuid(),
      stock,
      price,
      name,
      barcode,
      category_id,
      product_image,
    });

    this.products.push(product);

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const foundProduct = this.products.find(product => product.id === id);

    return foundProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const foundProduct = this.products.find(product => product.name === name);

    return foundProduct;
  }
}

export default FakeProductRepository;
