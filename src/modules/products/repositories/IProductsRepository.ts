import Product from '../infra/typeorm/entities/Product';

import ICreateProductDTO from '../dtos/ICreateProductDTO';
import ISearchProductDTO from '../dtos/ISearchProductDTO';
import IGetProductsDTO from '../dtos/IGetProductsDTO';
import ISingleSearchProductsDTO from '../dtos/ISingleSearchProductsDTO';

export default interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  findByName(name: string): Promise<Product | undefined>;
  findById(id: string): Promise<Product | undefined>;
  findByBarcode(id: string): Promise<Product | undefined>;
  findAllById(products_ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  // delete(id: string): Promise<DeleteResult>;
  getAllProducts(data: IGetProductsDTO): Promise<[Product[], number]>;
  findBySearchField(
    data: ISingleSearchProductsDTO,
  ): Promise<[Product[], number]>;
  findByCategoryField(
    data: ISingleSearchProductsDTO,
  ): Promise<[Product[], number]>;
  findBySearchAndCategoryField(
    data: ISearchProductDTO,
  ): Promise<[Product[], number]>;
}
