import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ISalesRepository from '../repositories/ISalesRepository';
import Sale from '../infra/typeorm/entities/Sale';

interface IRequest {
  is_admin: boolean;
}

@injectable()
class GetUnfinishedService {
  constructor(
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,
  ) {}

  public async execute({ is_admin }: IRequest): Promise<Sale[]> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    const sales = this.salesRepository.getUnfinished();

    return sales;
  }
}

export default GetUnfinishedService;
