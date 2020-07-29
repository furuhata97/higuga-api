import Category from '../infra/typeorm/entities/Category';

export default interface ICategoriesRepository {
  create(name: string): Promise<Category>;
  findByName(name: string): Promise<Category | undefined>;
  findById(id: string): Promise<Category | undefined>;
  // findAllById(products: IFindProducts[]): Promise<Product[]>;
  // updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
}
