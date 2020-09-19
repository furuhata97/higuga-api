import { getRepository, Repository, Between, Raw } from 'typeorm';

import ISalesRepository from '@modules/sales/repositories/ISalesRepository';
import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addHours,
} from 'date-fns';
import IGetUnfinishedSalesDTO from '@modules/sales/dtos/IGetUnfinishedSalesDTO';
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
    const startDate = addHours(startOfDay(sale_date), 3);
    const endDate = addHours(endOfDay(sale_date), 3);

    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startDate, endDate),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startDate, endDate),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getFinishedByWeek(sale_date: Date): Promise<Sale[]> {
    const startDate = addHours(startOfWeek(sale_date), 3);
    const endDate = addHours(endOfWeek(sale_date), 3);

    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startDate, endDate),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startDate, endDate),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getFinishedByMonth(sale_date: Date): Promise<Sale[]> {
    const startDate = addHours(startOfMonth(sale_date), 3);
    const endDate = addHours(endOfMonth(sale_date), 3);

    const salesEarlyPaid = await this.ormRepository.find({
      where: {
        status: 'FINALIZADO',
        created_at: Between(startDate, endDate),
      },
    });

    const salesLatePaid = await this.ormRepository.find({
      where: {
        status: 'PAGO',
        updated_at: Between(startDate, endDate),
      },
    });

    return salesEarlyPaid.concat(salesLatePaid);
  }

  public async getUnfinished({
    take,
    skip,
    search,
  }: IGetUnfinishedSalesDTO): Promise<[Sale[], number]> {
    if (!search) {
      const sales = await this.ormRepository.findAndCount({
        where: {
          status: 'AGUARDANDO PAGAMENTO',
        },
        take,
        skip,
        order: {
          created_at: 'ASC',
        },
      });

      return sales;
    }

    let searchName = search.toUpperCase();
    searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
    searchName = searchName.replace(/[ÈÉÊË]/, 'E');
    searchName = searchName.replace(/[ÚÙÛÜ]/, 'U');
    searchName = searchName.replace(/[ÕÓÒÔÖ]/, 'O');
    searchName = searchName.replace(/['Ç']/, 'C');

    const sales = await this.ormRepository.findAndCount({
      where: {
        client_name: Raw(
          nameField =>
            `${nameField} ILIKE '%${search}%' OR ${nameField} ILIKE '%${searchName}%'`,
        ),
      },
      take,
      skip,
      order: {
        created_at: 'ASC',
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
}

export default SalesRepository;
