import ICreateProductRemovalDTO from '../dtos/ICreateProductRemovalDTO';
import ProductRemoval from '../infra/typeorm/schemas/ProductRemoval';

export default interface IProductRemovalsRepository {
  create(data: ICreateProductRemovalDTO): Promise<ProductRemoval>;
  findByProductId(product_id: string): Promise<ProductRemoval | undefined>;
  findByDay(day: Date): Promise<ProductRemoval[]>;
  findByWeek(day: Date): Promise<ProductRemoval[]>;
  findByMonth(day: Date): Promise<ProductRemoval[]>;
}
