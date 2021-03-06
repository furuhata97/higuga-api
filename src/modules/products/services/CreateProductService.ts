/* eslint-disable no-plusplus */
import { inject, injectable } from 'tsyringe';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  barcode: string;
  stock: number;
  price: number;
  category_id: string;
  product_image?: string;
  is_admin: boolean;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
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

    const checkBarcode = await this.productsRepository.findByBarcode(barcode);

    if (checkBarcode) {
      throw new AppError('Product already exists');
    }

    if (barcode.length < 13 || barcode.length > 13) {
      throw new AppError('Invalid barcode');
    }

    const checkProductExists = await this.productsRepository.findByName(name);

    if (checkProductExists) {
      throw new AppError('Product already exists');
    }

    const checkCategoryExists = await this.categoriesRepository.findById(
      category_id,
    );

    if (!checkCategoryExists) {
      throw new AppError('There are no category with the informed id');
    }

    let filename = product_image || 'null';

    if (product_image) {
      filename = await this.storageProvider.saveFile(product_image);
    } else {
      filename = 'null';
    }

    const product = await this.productsRepository.create({
      name,
      barcode,
      price,
      stock,
      category_id,
      product_image: filename,
    });

    product.category = checkCategoryExists;

    return product;
  }
}

export default CreateProductService;
