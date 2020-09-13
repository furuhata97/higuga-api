import { getRepository, Repository, Between } from 'typeorm';

import ISalesRepository from '@modules/sales/repositories/ISalesRepository';
import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
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

  public async getFinishedByDate(sale_date: Date): Promise<Sale[]> {
    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startOfDay(sale_date), endOfDay(sale_date)),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startOfDay(sale_date), endOfDay(sale_date)),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getFinishedByWeek(sale_date: Date): Promise<Sale[]> {
    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startOfWeek(sale_date), endOfWeek(sale_date)),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startOfWeek(sale_date), endOfWeek(sale_date)),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getFinishedByMonth(sale_date: Date): Promise<Sale[]> {
    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startOfMonth(sale_date), endOfMonth(sale_date)),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startOfMonth(sale_date), endOfMonth(sale_date)),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getUnfinished(): Promise<Sale[]> {
    const sales = await this.ormRepository.find({
      where: {
        status: 'AGUARDANDO PAGAMENTO',
      },
    });

    return sales;
  }

  public async save(sale: Sale): Promise<Sale> {
    const savedSale = await this.ormRepository.save(sale);

    return savedSale;
  }

  public async findById(sale_id: string): Promise<Sale | undefined> {
    const sale = await this.ormRepository.findOne(sale_id);

    return sale;
  }

  // public async findById(id: string): Promise<Order | undefined> {
  //   const order = await this.ormRepository.findOne({ id });

  //   return order;
  // }
}

export default SalesRepository;
