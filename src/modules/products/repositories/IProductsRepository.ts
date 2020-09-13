import { DeleteResult } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';

import ICreateProductDTO from '../dtos/ICreateProductDTO';
import ISearchProductDTO from '../dtos/ISearchProductDTO';

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findByName(name: string): Promise<Product | undefined>;
  findById(id: string): Promise<Product | undefined>;
  findByBarcode(id: string): Promise<Product | undefined>;
  findAllById(products_ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  // delete(id: string): Promise<DeleteResult>;
  getAllProducts(): Promise<Product[]>;
  findBySearchField(search_word: string): Promise<Product[]>;
  findByCategoryField(category_id: string): Promise<Product[]>;
  findBySearchAndCategoryField(data: ISearchProductDTO): Promise<Product[]>;
  // updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
}
