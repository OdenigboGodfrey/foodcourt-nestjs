import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { Addon } from '../entities/addon.entity';

export type AddonRepositoryInterface = BaseInterfaceRepository<Addon>;

@Injectable()
export class AddonRepository
  extends BaseAbstractRepository<Addon>
  implements AddonRepositoryInterface
{
  constructor() {
    super();
  }
}
