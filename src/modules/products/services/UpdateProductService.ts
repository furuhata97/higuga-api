import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICategoriesRepository from '@modules/products/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  price: number;
  category_id: string;
  product_image?: string;
  is_admin: boolean;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    id,
    name,
    barcode,
    price,
    stock,
    category_id,
    product_image,
    is_admin,
  }: IRequest): Promise<Product> {
    if (!is_admin) {
      throw new AppError('User does not have permission for this action');
    }

    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('The product is not registered');
    }

    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new AppError('The selected category is not registered');
    }

    product.name = name;
    product.barcode = barcode;
    product.price = price;
    product.stock = stock;
    product.category_id = category_id;
    product.category = category;

    let filename = '';
    if (product_image) {
      await this.storageProvider.deleteFile(product.product_image);
      filename = await this.storageProvider.saveFile(product_image);
    } else {
      filename = product.product_image;
    }

    product.product_image = filename;

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
