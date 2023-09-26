import { Inject, Injectable } from '@nestjs/common';
import { OrderType } from '../entities/order-type.entity';
import { OrderTypeRepositoryInterface } from '../repository/order-type.repository';

@Injectable()
export class OrderTypeService {
  constructor(
    @Inject('OrderTypeRepositoryInterface')
    private readonly repository: OrderTypeRepositoryInterface,
  ) {}
  async create(orderData: Partial<OrderType>): Promise<OrderType> {
    return this.repository.create(OrderType, orderData);
  }

  async getAll(): Promise<OrderType[]> {
    return this.repository.findAll(OrderType);
  }

  async getById(id: number): Promise<OrderType> {
    return this.repository.findOneById(OrderType, id);
  }

  async update(
    id: number,
    updatedData: Partial<OrderType>,
  ): Promise<OrderType> {
    await this.repository.UpdateOne(OrderType, id, updatedData);
    return this.repository.findOneById(OrderType, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(OrderType, id);
  }
}
