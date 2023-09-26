import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { Meal } from '../entities/meals.entity';

export type MealRepositoryInterface = BaseInterfaceRepository<Meal>;

@Injectable()
export class MealRepository
  extends BaseAbstractRepository<Meal>
  implements MealRepositoryInterface
{
  constructor() {
    super();
  }
}
