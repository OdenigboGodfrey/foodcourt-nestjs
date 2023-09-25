import { Injectable } from '@nestjs/common';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandService {
  async create(brandData: Partial<Brand>): Promise<Brand> {
    return Brand.query().insert(brandData);
  }

  async getAll(): Promise<Brand[]> {
    return Brand.query();
  }

  async getById(id: number): Promise<Brand> {
    return Brand.query().findById(id);
  }

  async update(id: number, updatedData: Partial<Brand>): Promise<Brand> {
    await Brand.query().findById(id).patch(updatedData);
    return Brand.query().findById(id);
  }

  async delete(id: number): Promise<number> {
    return Brand.query().deleteById(id);
  }
}
