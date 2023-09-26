import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryInterface } from '../repository/order.repository';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly repository: OrderRepositoryInterface,
  ) {}
  async create(orderData: Partial<Order>): Promise<Order> {
    return this.repository.create(Order, orderData);
  }

  async getAll(): Promise<Order[]> {
    return this.repository.findAll(Order);
  }

  async getById(id: number): Promise<Order> {
    return this.repository.findOneById(Order, id);
  }

  async update(id: number, updatedData: Partial<Order>): Promise<Order> {
    await this.repository.UpdateOne(Order, id, updatedData);
    return this.repository.findOneById(Order, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(Order, id);
  }
}
