export const sqsConfig = {
  consumers: [
    {
      name: 'order-queue',
      queueUrl: 'http://localhost:4566/000000000000/order-queue',
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
      },
    },
  ],
  producers: [
    {
      name: 'order-queue',
      queueUrl: 'http://localhost:4566/000000000000/order-queue',
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
      },
    },
  ],
};
