import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';
import { CreateOrderDto } from './dtos';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() order: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(order);
  }
}
