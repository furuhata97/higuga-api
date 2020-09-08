import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true,
    eager: true,
  })
  order_products: OrdersProducts[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discount: number;

  @Column()
  status: string;

  @Column()
  payment_method: string;

  @Column()
  zip_code: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
