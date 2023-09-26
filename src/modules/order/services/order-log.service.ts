import { Inject, Injectable } from '@nestjs/common';
import { OrderLog } from '../entities/order-log.entity';
import { OrderLogRepositoryInterface } from '../repository/order-log.repository';

@Injectable()
export class OrderLogService {
  constructor(
    @Inject('OrderLogRepositoryInterface')
    private readonly repository: OrderLogRepositoryInterface,
  ) {}
  async create(orderData: Partial<OrderLog>): Promise<OrderLog> {
    return this.repository.create(OrderLog, orderData);
  }

  async getAll(): Promise<OrderLog[]> {
    return this.repository.findAll(OrderLog);
  }

  async getById(id: number): Promise<OrderLog> {
    return this.repository.findOneById(OrderLog, id);
  }

  async update(id: number, updatedData: Partial<OrderLog>): Promise<OrderLog> {
    await this.repository.UpdateOne(OrderLog, id, updatedData);
    return this.repository.findOneById(OrderLog, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(OrderLog, id);
  }
}
