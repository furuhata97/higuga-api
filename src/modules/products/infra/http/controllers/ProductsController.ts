import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import GetProductsService from '@modules/products/services/GetProductsService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import { classToClass } from 'class-transformer';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, barcode, stock, price, category_id } = request.body;
    const { is_admin } = request.user;
    const product_image =
      request.file !== undefined ? request.file.filename : undefined;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      barcode,
      stock,
      price,
      product_image,
      category_id,
      is_admin,
    });

    return response.json(classToClass(product));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { take, skip, type } = request.query;
    const getProducts = container.resolve(GetProductsService);
    const products = await getProducts.execute({
      take: Number(take),
      skip: Number(skip),
      type: String(type),
    });

    return response.json(classToClass(products));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, barcode, stock, price, category_id } = request.body;
    const { is_admin } = request.user;
    const product_image =
      request.file !== undefined ? request.file.filename : undefined;

    const updateProduct = container.resolve(UpdateProductService);

    const product = await updateProduct.execute({
      id,
      name,
      barcode,
      stock,
      price,
      product_image,
      category_id,
      is_admin,
    });

    return response.json(classToClass(product));
  }
}
