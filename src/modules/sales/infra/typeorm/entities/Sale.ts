import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';

import SalesProducts from '@modules/sales/infra/typeorm/entities/SalesProducts';

@Entity('sales')
class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_name: string;

  @OneToMany(() => SalesProducts, sale_products => sale_products.sale, {
    cascade: true,
    eager: true,
  })
  sale_products: SalesProducts[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  money_received: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  change: number;

  @Column()
  status: string;

  @Column()
  payment_method: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Sale;
