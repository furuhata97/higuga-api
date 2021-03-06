import { inject, injectable } from 'tsyringe';
import { startOfMonth, startOfWeek, startOfDay } from 'date-fns';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISalesRepository from '../repositories/ISalesRepository';

import Sale from '../infra/typeorm/entities/Sale';

interface IRequest {
  sale_id: string;
  payment_method: string;
  is_admin: boolean;
  money_received?: number;
}

@injectable()
class UpdateSaleService {
  constructor(
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    sale_id,
    payment_method,
    money_received,
    is_admin,
  }: IRequest): Promise<Sale> {
    if (!is_admin) {
      throw new AppError('You do not have authorization for this action');
    }

    const payment = payment_method.toUpperCase();
    const paymentWords = ['CARTAO', 'DINHEIRO'];

    if (!paymentWords.includes(payment)) {
      throw new AppError('Invalid payment method');
    }

    if (payment === 'DINHEIRO' && !money_received) {
      throw new AppError(
        'It is needed to inform the amount of money you received',
      );
    }

    if (money_received && payment !== 'DINHEIRO') {
      throw new AppError(
        'You can only receive money if the payment method is in money',
      );
    }

    const saleToUpdate = await this.salesRepository.findById(sale_id);

    if (!saleToUpdate) {
      throw new AppError('Sale not found');
    }

    if (saleToUpdate.payment_method !== 'FIADO') {
      throw new AppError('You cannot update this sale');
    }

    if (money_received && money_received < saleToUpdate.total) {
      throw new AppError('The money received is lesser than the total amount');
    }

    if (money_received) {
      saleToUpdate.money_received = money_received;
      saleToUpdate.change = money_received - saleToUpdate.total;
    }

    saleToUpdate.payment_method = payment;
    saleToUpdate.status = 'PAGO';

    const updatedSale = await this.salesRepository.save(saleToUpdate);

    const startDay = startOfDay(new Date());
    const startWeek = startOfWeek(new Date());
    const startMonth = startOfMonth(new Date());

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startDay)}:day`,
    );

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startWeek)}:week`,
    );

    await this.cacheProvider.invalidate(
      `sales-list:${JSON.stringify(startMonth)}:month`,
    );

    return updatedSale;
  }
}

export default UpdateSaleService;
