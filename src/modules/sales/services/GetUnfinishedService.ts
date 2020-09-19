import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ISalesRepository from '../repositories/ISalesRepository';
import Sale from '../infra/typeorm/entities/Sale';

interface IRequest {
  take: number;
  skip: number;
  search: string | undefined;
  is_admin: boolean;
}

@injectable()
class GetUnfinishedService {
  constructor(
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,
  ) {}

  public async execute({
    take,
    skip,
    search,
    is_admin,
  }: IRequest): Promise<[Sale[], number]> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    const sales = await this.salesRepository.getUnfinished({
      take,
      skip,
      search: search || undefined,
    });

    return sales;
  }
}

export default GetUnfinishedService;
