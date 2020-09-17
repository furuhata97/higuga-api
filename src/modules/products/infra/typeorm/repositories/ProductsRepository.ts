import { getRepository, Repository, Raw } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import ISearchProductDTO from '@modules/products/dtos/ISearchProductDTO';
// import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import IGetProductsDTO from '@modules/products/dtos/IGetProductsDTO';
import ISingleSearchProducts from '@modules/products/dtos/ISingleSearchProductsDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    barcode,
    stock,
    product_image,
    category_id,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      barcode,
      stock,
      product_image,
      category_id,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findByBarcode(barcode: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { barcode },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }

  public async findAllById(products_ids: string[]): Promise<Product[]> {
    const foundProducts = await this.ormRepository.findByIds(products_ids);

    if (foundProducts.length !== products_ids.length) {
      throw new AppError('One or more products do not exist');
    }

    return foundProducts;
  }

  public async save(product: Product): Promise<Product> {
    const savedProduct = await this.ormRepository.save(product);

    return savedProduct;
  }

  public async getAllProducts({
    take,
    skip,
    type,
  }: IGetProductsDTO): Promise<[Product[], number]> {
    if (type === 'public') {
      const products = await this.ormRepository.findAndCount({
        where: { hidden: false },
        take,
        skip,
      });

      return products;
    }
    if (type === 'private') {
      const products = await this.ormRepository.findAndCount({
        take,
        skip,
      });

      return products;
    }

    throw new AppError('The informed type is incorrect');
  }

  public async findBySearchField({
    take,
    skip,
    type,
    search,
  }: ISingleSearchProducts): Promise<[Product[], number]> {
    let searchName = search.toUpperCase();
    searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
    searchName = searchName.replace(/[ÈÉÊË]/, 'E');
    searchName = searchName.replace(/[ÚÙÛÜ]/, 'U');
    searchName = searchName.replace(/[ÕÓÒÔÖ]/, 'O');
    searchName = searchName.replace(/['Ç']/, 'C');

    if (type === 'public') {
      const products = await this.ormRepository.findAndCount({
        where: {
          name: Raw(
            nameField => `unaccent(${nameField}) ILIKE unaccent('%${search}%')`,
          ),
          hidden: false,
        },
        take,
        skip,
      });

      return products;
    }

    if (type === 'private') {
      const products = await this.ormRepository.findAndCount({
        where: {
          name: Raw(
            nameField =>
              `${nameField} ILIKE '%${search}%' OR ${nameField} ILIKE '%${searchName}%'`,
          ),
        },
        take,
        skip,
      });

      return products;
    }

    throw new AppError('The informed type is incorrect');
  }

  public async findByCategoryField({
    take,
    skip,
    type,
    search,
  }: ISingleSearchProducts): Promise<[Product[], number]> {
    if (type === 'public') {
      const products = await this.ormRepository.findAndCount({
        where: {
          category_id: search,
          hidden: false,
        },
        take,
        skip,
      });

      return products;
    }

    if (type === 'private') {
      const products = await this.ormRepository.findAndCount({
        where: {
          category_id: search,
        },
        take,
        skip,
      });

      return products;
    }

    throw new AppError('The informed type is incorrect');
  }

  public async findBySearchAndCategoryField({
    search_word,
    category_id,
    take,
    skip,
    type,
  }: ISearchProductDTO): Promise<[Product[], number]> {
    let searchName = search_word.toUpperCase();
    searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
    searchName = searchName.replace(/[ÈÉÊË]/, 'E');
    searchName = searchName.replace(/[ÚÙÛÜ]/, 'U');
    searchName = searchName.replace(/[ÕÓÒÔÖ]/, 'O');
    searchName = searchName.replace(/['Ç']/, 'C');

    if (type === 'public') {
      const products = await this.ormRepository.findAndCount({
        where: {
          name: Raw(
            nameField =>
              `${nameField} ILIKE '%${search_word}%' OR ${nameField} ILIKE '%${searchName}%'`,
          ),
          category_id,
          hidden: false,
        },
        take,
        skip,
      });

      return products;
    }

    if (type === 'private') {
      const products = await this.ormRepository.findAndCount({
        where: {
          name: Raw(
            nameField =>
              `${nameField} ILIKE '%${search_word}%' OR ${nameField} ILIKE '%${searchName}%'`,
          ),
          category_id,
        },
        take,
        skip,
      });

      return products;
    }

    throw new AppError('The informed type is incorrect');
  }

  // public async delete(id: string): Promise<DeleteResult> {
  //   const result = await this.ormRepository.delete(id);
  //   return result;
  // }

  // public async findAllById(products: IFindProducts[]): Promise<Product[]> {
  //   const ids = products.map(product => product.id);
  //   const foundProducts = await this.ormRepository.find({ id: In(ids) });

  //   if (ids.length !== foundProducts.length) {
  //     throw new AppError('One or more products do not exist');
  //   }

  //   return foundProducts;
  // }

  // public async updateQuantity(
  //   products: IUpdateProductsQuantityDTO[],
  // ): Promise<Product[]> {
  //   const foundProducts = await this.findAllById(products);
  //   const updateQuantity = foundProducts.map(product => {
  //     const foundProduct = products.find(
  //       fProduct => fProduct.id === product.id,
  //     );
  //     if (!foundProduct) {
  //       throw new AppError('Product not found');
  //     }

  //     if (product.quantity < foundProduct.quantity) {
  //       throw new AppError(
  //         `There are not enough quantity in stock for the product ${product.name}`,
  //       );
  //     }

  //     const productUpdated = product;
  //     productUpdated.quantity -= foundProduct.quantity;

  //     return productUpdated;
  //   });

  //   await this.ormRepository.save(updateQuantity);

  //   return updateQuantity;
  // }
}

export default ProductsRepository;
