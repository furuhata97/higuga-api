interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

export default interface ICreateSaleDTO {
  client_name: string;
  products: IProduct[];
  total: number;
  discount?: number;
  payment_method: string;
  money_received: number;
  change: number;
}
