import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ProductRemoval from '../infra/typeorm/schemas/ProductRemoval';

import IProductsRemovalRepository from '../repositories/IProductsRemovalRepository';

interface IRequest {
  date: Date;
  type: string;
  is_admin: boolean;
}

@injectable()
export default class FindProductsRemovalsByDateService {
  constructor(
    @inject('ProductsRemovalRepository')
    private productsRemovalRepository: IProductsRemovalRepository,
  ) {}

  public async execute({
    date,
    type,
    is_admin,
  }: IRequest): Promise<ProductRemoval[]> {
    if (!is_admin) {
      throw new AppError('User does not have permission for this action');
    }

    if (type === 'day') {
      const productsRemoval = await this.productsRemovalRepository.findByDay(
        date,
      );

      return productsRemoval;
    }

    if (type === 'week') {
      const productsRemoval = this.productsRemovalRepository.findByWeek(date);

      return productsRemoval;
    }

    if (type === 'month') {
      const productsRemoval = this.productsRemovalRepository.findByMonth(date);

      return productsRemoval;
    }

    return [];
  }
}
