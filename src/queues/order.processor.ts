import { Injectable } from '@nestjs/common';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OrderProcessor {
  private s3 = new S3({
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true,
  });

  @SqsMessageHandler('order-queue', false)
  async handleSendMessage(message: AWS.SQS.Message) {
    console.log('Received message:', message);
    try {
      const { orderId, totalPrice } = JSON.parse(message.Body);

      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const invoiceContent = `Invoice for Order #${orderId} \n total: ${totalPrice}`;
      const invoicePath = path.join(tempDir, `invoice-${orderId}.txt`);

      fs.writeFileSync(invoicePath, invoiceContent);

      await this.s3
        .upload({
          Bucket: 'invoices',
          Key: `order-${orderId}.txt`,
          Body: fs.createReadStream(invoicePath),
        })
        .promise();

      console.log(`Invoice for order ${orderId} uploaded to S3`);

      fs.unlinkSync(invoicePath);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  @SqsConsumerEventHandler('order-queue', 'processing_error')
  public onProcessingError(error: Error, message: AWS.SQS.Message) {
    console.error(`Error processing message: ${message.MessageId}`, error);
  }
}
