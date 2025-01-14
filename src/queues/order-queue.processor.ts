import { Processor, Process } from '@nestjs/bull';
import { S3 } from 'aws-sdk';
import { Job } from 'bull';
import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

@Processor('order')
export class OrderQueueProcessor {
  private s3 = new S3({
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true,
  });

  @Process('order-created')
  async handleOrderCreated(job: Job) {
    try {
      const { orderId, totalPrice } = job.data;

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
      console.error(error);
      throw new InternalServerErrorException('Error processing order');
    }
  }
}
