import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Sale from '@modules/sales/infra/typeorm/entities/Sale';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('sales_products')
class SalesProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  sale_id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column('decimal')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SalesProducts;
