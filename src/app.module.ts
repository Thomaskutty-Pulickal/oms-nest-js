import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { AuthModule } from './auth/auth.module';
import { QueuesModule } from './queues/queues.module';
import { sqsConfig } from './configs/sqs.config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'oms',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SqsModule.register(sqsConfig),
    UsersModule,
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
    AuthModule,
    QueuesModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
