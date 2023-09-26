import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { CalculatedOrder } from '../entities/calculated-order.entity';

export type CalculatedOrderRepositoryInterface =
  BaseInterfaceRepository<CalculatedOrder>;

@Injectable()
export class CalculatedOrderRepository
  extends BaseAbstractRepository<CalculatedOrder>
  implements CalculatedOrderRepositoryInterface
{
  constructor() {
    super();
  }
}
