import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from 'src/products/products.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductsModule,
    BullModule.registerQueue({
      name: 'order',
    }),
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
