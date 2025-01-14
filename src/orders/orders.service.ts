import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { OrderItem } from 'src/order-items/order-items.entity';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from './dtos';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SqsService } from '@ssut/nestjs-sqs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
    @InjectQueue('order') private readonly orderQueue: Queue,
    private readonly sqsService: SqsService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async create(newOrder: CreateOrderDto): Promise<Order> {
    const items = newOrder.items;
    if (!items || !items.length) {
      throw new Error('Order must have at least one order item');
    }
    const order = new Order();
    const orderItems: OrderItem[] = [];
    let totalPrice = 0;

    for (const item of items) {
      const orderItem = new OrderItem();
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with id ${item.productId} not found`,
        );
      }
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      orderItems.push(orderItem);
      totalPrice += product.price * item.quantity;
    }
    order.orderItems = orderItems;
    order.totalPrice = totalPrice;
    const savedOrder = await this.ordersRepository.save(order);
    try {
      await this.sqsService.send('order-queue', {
        id: String(savedOrder.id),
        body: JSON.stringify({
          orderId: savedOrder.id,
          totalPrice: savedOrder.totalPrice,
        }),
        delaySeconds: 0,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Could not create order');
    }
    return savedOrder;
  }
}
