import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../orders/orders.entity';
import { Product } from '../products/products.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;
}
