import Sale from '../infra/typeorm/entities/Sale';

import ICreateSaleDTO from '../dtos/ICreateSaleDTO';

export default interface ISalesRepository {
  create(data: ICreateSaleDTO): Promise<Sale>;
}
