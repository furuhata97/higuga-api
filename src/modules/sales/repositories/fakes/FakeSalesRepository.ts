import { uuid } from 'uuidv4';
import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';
import ISalesRepository from '../ISalesRepository';
import Sale from '../../infra/typeorm/entities/Sale';

class FakeSalesRepository implements ISalesRepository {
  private sales: Sale[] = [];

  public async create({
    payment_method,
    total,
    client_name,
    products,
    discount,
  }: ICreateSaleDTO): Promise<Sale> {
    const sale = new Sale();
    const status =
      payment_method === 'FIADO' ? 'AGUARDANDO PAGAMENTO' : 'FINALIZADO';

    Object.assign(sale, {
      id: uuid(),
      client_name,
      total,
      discount,
      order_products: products,
      payment_method,
      status,
    });

    this.sales.push(sale);

    return sale;
  }
}

export default FakeSalesRepository;
