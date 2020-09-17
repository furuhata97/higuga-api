import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('products_removals')
class ProductRemoval {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  product_name: string;

  @Column('uuid')
  product_id: string;

  @Column()
  quantity_removed: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ProductRemoval;
