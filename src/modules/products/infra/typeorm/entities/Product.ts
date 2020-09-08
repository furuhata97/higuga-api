import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import { Expose } from 'class-transformer';
import Category from './Category';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @Column()
  barcode: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  stock: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column()
  product_image: string;

  @OneToMany(() => OrdersProducts, order_products => order_products.product)
  order_products: OrdersProducts[];

  @Column()
  hidden: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  getAvatarUrl(): string | null {
    return this.product_image !== 'null'
      ? `${process.env.APP_API_URL}/files/${this.product_image}`
      : null;
  }
}

export default Product;
