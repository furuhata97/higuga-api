import ICreateProductRemovalDTO from '../dtos/ICreateProductRemovalDTO';
import ProductRemoval from '../infra/typeorm/schemas/ProductRemoval';

export default interface IProductRemovalsRepository {
  create(data: ICreateProductRemovalDTO): Promise<ProductRemoval>;
}
