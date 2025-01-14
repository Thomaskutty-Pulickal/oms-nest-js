import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { OrderQueueProcessor } from './order-queue.processor';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [OrderQueueProcessor, OrderProcessor],
})
export class QueuesModule {}
