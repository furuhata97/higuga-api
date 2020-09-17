import { inject, injectable } from 'tsyringe';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISalesRepository from '../repositories/ISalesRepository';
import Sale from '../infra/typeorm/entities/Sale';

interface IRequest {
  sale_date: Date;
  time: string;
  is_admin: boolean;
}

@injectable()
class GetFinishedSalesByDateService {
  constructor(
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    sale_date,
    time,
    is_admin,
  }: IRequest): Promise<Sale[]> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    if (time === 'day') {
      const startDate = startOfDay(sale_date);
      const cacheKey = `sales-list:${JSON.stringify(startDate)}:${time}`;

      // const sales = await this.cacheProvider.recover<Sale[]>(cacheKey);

      // await this.cacheProvider.invalidate(
      //   `sales-list:${JSON.stringify(startDate)}:day`,
      // );

      // return sales || [];

      // ---------------------

      let sales = await this.cacheProvider.recover<Sale[]>(cacheKey);

      if (!sales || !sales.length) {
        sales = await this.salesRepository.getFinishedByDate(sale_date);

        await this.cacheProvider.save(cacheKey, classToClass(sales));
      }

      return sales;

      // const sales = await this.salesRepository.getFinishedByDate(sale_date);
      // return sales;
    }

    if (time === 'week') {
      const startDate = startOfWeek(sale_date);
      const cacheKey = `sales-list:${JSON.stringify(startDate)}:${time}`;

      let sales = await this.cacheProvider.recover<Sale[]>(cacheKey);

      if (!sales || !sales.length) {
        sales = await this.salesRepository.getFinishedByWeek(sale_date);

        await this.cacheProvider.save(cacheKey, classToClass(sales));
      }

      return sales;
    }

    if (time === 'month') {
      const startDate = startOfMonth(sale_date);
      const cacheKey = `sales-list:${JSON.stringify(startDate)}:${time}`;

      let sales = await this.cacheProvider.recover<Sale[]>(cacheKey);

      if (!sales || !sales.length) {
        sales = await this.salesRepository.getFinishedByMonth(sale_date);

        await this.cacheProvider.save(cacheKey, classToClass(sales));
      }

      return sales;
    }

    throw new AppError('The time range can only be in day, week or month');
  }
}

export default GetFinishedSalesByDateService;
