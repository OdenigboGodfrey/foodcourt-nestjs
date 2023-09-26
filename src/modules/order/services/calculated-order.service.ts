import { Inject, Injectable } from '@nestjs/common';
import { CalculatedOrderRepositoryInterface } from '../repository/calculated-order.repository';
import { CalculatedOrder } from '../entities/calculated-order.entity';

@Injectable()
export class CalculatedOrderService {
  constructor(
    @Inject('CalculatedOrderRepositoryInterface')
    private readonly repository: CalculatedOrderRepositoryInterface,
  ) {}
  async create(
    calculatedOrderData: Partial<CalculatedOrder>,
  ): Promise<CalculatedOrder> {
    return this.repository.create(CalculatedOrder, calculatedOrderData);
  }

  async getAll(): Promise<CalculatedOrder[]> {
    return this.repository.findAll(CalculatedOrder);
  }

  async getById(id: number): Promise<CalculatedOrder> {
    return this.repository.findOneById(CalculatedOrder, id);
  }

  async update(
    id: number,
    updatedData: Partial<CalculatedOrder>,
  ): Promise<CalculatedOrder> {
    await this.repository.UpdateOne(CalculatedOrder, id, updatedData);
    return this.repository.findOneById(CalculatedOrder, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(CalculatedOrder, id);
  }
}
