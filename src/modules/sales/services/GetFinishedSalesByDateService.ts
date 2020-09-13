import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
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
      const sales = this.salesRepository.getFinishedByDate(sale_date);

      return sales;
    }

    if (time === 'week') {
      const sales = this.salesRepository.getFinishedByWeek(sale_date);

      return sales;
    }

    if (time === 'month') {
      const sales = this.salesRepository.getFinishedByMonth(sale_date);

      return sales;
    }

    throw new AppError('The time range can only be in day, week or month');
  }
}

export default GetFinishedSalesByDateService;
