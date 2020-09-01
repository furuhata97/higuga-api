import { uuid } from 'uuidv4';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import ISearchProductDTO from '@modules/products/dtos/ISearchProductDTO';

import AppError from '@shared/errors/AppError';
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

  public async findAllById(products_ids: string[]): Promise<Product[]> {
    const foundProducts = products_ids.map(id => {
      const foundProduct = this.products.find(product => product.id === id);

      if (!foundProduct) {
        throw new AppError('Product not found');
      }

      return foundProduct;
    });

    if (foundProducts.length !== products_ids.length) {
      throw new AppError('One or more products do not exist');
    }

    return foundProducts;
  }

  public async save(product: Product): Promise<Product> {
    const productIndex = this.products.findIndex(p => p.id === product.id);
    this.products[productIndex] = product;

    return product;
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  public async findBySearchField(search_word: string): Promise<Product[]> {
    const searchedProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(search_word.toLowerCase()),
    );

    return searchedProducts;
  }

  public async findByCategoryField(category_id: string): Promise<Product[]> {
    const searchedProducts = this.products.filter(
      p => p.category_id === category_id,
    );

    return searchedProducts;
  }

  public async findBySearchAndCategoryField(
    data: ISearchProductDTO,
  ): Promise<Product[]> {
    const searchedProducts = this.products.filter(
      p =>
        p.name.toLowerCase().includes(data.search_word.toLowerCase()) &&
        p.category_id === data.category_id,
    );

    return searchedProducts;
  }
}

export default FakeProductRepository;
