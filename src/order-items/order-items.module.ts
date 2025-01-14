import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  exports: [TypeOrmModule],
})
export class OrderItemsModule {}
