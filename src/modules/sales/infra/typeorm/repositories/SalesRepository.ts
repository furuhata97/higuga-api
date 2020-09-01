import { getRepository, Repository } from 'typeorm';

import ISalesRepository from '@modules/sales/repositories/ISalesRepository';
import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';
import Sale from '../entities/Sale';

class SalesRepository implements ISalesRepository {
  private ormRepository: Repository<Sale>;

  constructor() {
    this.ormRepository = getRepository(Sale);
  }

  public async create({
    client_name,
    products,
    payment_method,
    total,
    discount,
    money_received,
    change,
  }: ICreateSaleDTO): Promise<Sale> {
    const status =
      payment_method === 'FIADO' ? 'AGUARDANDO PAGAMENTO' : 'FINALIZADO';
    const sale = this.ormRepository.create({
      client_name,
      sale_products: products,
      payment_method,
      total,
      discount,
      status,
      money_received,
      change,
    });

    await this.ormRepository.save(sale);

    return sale;
  }

  // public async findById(id: string): Promise<Order | undefined> {
  //   const order = await this.ormRepository.findOne({ id });

  //   return order;
  // }
}

export default SalesRepository;
