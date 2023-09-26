import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { OrderType } from '../entities/order-type.entity';

export type OrderTypeRepositoryInterface = BaseInterfaceRepository<OrderType>;

@Injectable()
export class OrderTypeRepository
  extends BaseAbstractRepository<OrderType>
  implements OrderTypeRepositoryInterface
{
  constructor() {
    super();
  }
}
