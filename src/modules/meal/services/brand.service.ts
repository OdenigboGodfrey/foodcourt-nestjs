import { Inject, Injectable } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';
import { BrandRepositoryInterface } from '../repository/brand.repository';

@Injectable()
export class BrandService {
  constructor(
    @Inject('BrandRepositoryInterface')
    private readonly repository: BrandRepositoryInterface,
  ) {}
  async create(payload: Partial<Brand>): Promise<Brand> {
    return this.repository.create(Brand, payload);
  }

  async getAll(): Promise<Brand[]> {
    return this.repository.findAll(Brand);
  }

  async getById(id: number): Promise<Brand> {
    return this.repository.findOneById(Brand, id);
  }

  async update(id: number, updatedData: Partial<Brand>): Promise<Brand> {
    await this.repository.UpdateOne(Brand, id, updatedData);
    return this.repository.findOneById(Brand, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(Brand, id);
  }
}
