import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OrderService } from '../services/order.service';

@Processor('orders')
export class OrdersProcessorWorker {
  constructor(private readonly service: OrderService) {}
  private readonly logger = new Logger(OrdersProcessorWorker.name);

  @Process('create')
  handle(job: Job) {
    console.log('job data', job.data);
    this.service.create(job.data).then((result) => {
      console.log('result', result);
    });
  }
}
