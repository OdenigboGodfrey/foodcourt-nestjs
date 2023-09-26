import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { OrderLog } from '../entities/order-log.entity';

export type OrderLogRepositoryInterface = BaseInterfaceRepository<OrderLog>;

@Injectable()
export class OrderLogRepository
  extends BaseAbstractRepository<OrderLog>
  implements OrderLogRepositoryInterface
{
  constructor() {
    super();
  }
}
