import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { Brand } from '../entities/brand.entity';

export type BrandRepositoryInterface = BaseInterfaceRepository<Brand>;

@Injectable()
export class BrandRepository
  extends BaseAbstractRepository<Brand>
  implements BrandRepositoryInterface
{
  constructor() {
    super();
  }
}
