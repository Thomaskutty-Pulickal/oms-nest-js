import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '../order-items/order-items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', default: 0 })
  totalPrice!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems!: OrderItem[];
}
