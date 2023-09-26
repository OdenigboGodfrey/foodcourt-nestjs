import { Inject, Injectable } from '@nestjs/common';
import { Addon } from '../entities/addon.entity';
import { AddonRepositoryInterface } from '../repository/addon.repository';

@Injectable()
export class AddonService {
  constructor(
    @Inject('AddonRepositoryInterface')
    private readonly repository: AddonRepositoryInterface,
  ) {}
  async create(payload: Partial<Addon>): Promise<Addon> {
    return this.repository.create(Addon, payload);
  }

  async getAll(): Promise<Addon[]> {
    return this.repository.findAll(Addon);
  }

  async getById(id: number): Promise<Addon> {
    return this.repository.findOneById(Addon, id);
  }

  async update(id: number, updatedData: Partial<Addon>): Promise<Addon> {
    await this.repository.UpdateOne(Addon, id, updatedData);
    return this.repository.findOneById(Addon, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(Addon, id);
  }
}
