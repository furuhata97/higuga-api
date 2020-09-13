import Sale from '../infra/typeorm/entities/Sale';

import ICreateSaleDTO from '../dtos/ICreateSaleDTO';

export default interface ISalesRepository {
  create(data: ICreateSaleDTO): Promise<Sale>;
  getFinishedByDate(sale_date: Date): Promise<Sale[]>;
  getFinishedByWeek(sale_date: Date): Promise<Sale[]>;
  getFinishedByMonth(sale_date: Date): Promise<Sale[]>;
  getUnfinished(): Promise<Sale[]>;
  save(sale: Sale): Promise<Sale>;
  findById(sale_id: string): Promise<Sale | undefined>;
}
