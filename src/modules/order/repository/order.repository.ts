import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { Order } from '../entities/order.entity';

export type OrderRepositoryInterface = BaseInterfaceRepository<Order>;

@Injectable()
export class OrderRepository
  extends BaseAbstractRepository<Order>
  implements OrderRepositoryInterface
{
  constructor() {
    super();
  }
}
