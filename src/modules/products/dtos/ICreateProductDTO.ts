export default interface ICreateProductDTO {
  name: string;
  barcode: string;
  stock: number;
  price: number;
  product_image?: string;
  category_id: string;
}
