import { Model, QueryBuilder } from 'objection';

export interface BaseInterfaceRepository<T extends Model> {
  create(entityModel: new () => T, data: Partial<T>): Promise<T>;

  findOneById(entityModel: new () => T, id: number): Promise<T | undefined>;

  findByCondition(
    entityModel: new () => T,
    filterCondition: object,
  ): Promise<T[]>;

  findOneByCondition(
    entityModel: new () => T,
    filterCondition: object,
  ): Promise<T | undefined>;

  findAll(entityModel: new () => T): Promise<T[]>;

  remove(entityModel: new () => T, id: number): Promise<number>;

  findOneWhere(
    entityModel: new () => T,
    filterCondition: object,
  ): Promise<T | undefined>;

  findWhere(entityModel: new () => T, filterCondition: object): Promise<T[]>;

  UpdateOne(
    entityModel: new () => T,
    id: number,
    data: Partial<T>,
  ): Promise<T | undefined>;

  createBulk(
    entityModel: new () => T,
    data: T[] | any,
  ): Promise<{ inserted: number; data: T[] }>;

  count(entityModel: new () => T, filterCondition: object): Promise<number>;

  // Additional methods specific to Objection.js
  query(entityModel: new () => T): QueryBuilder<T>;

  upsert(
    entityModel: new () => T,
    data: Partial<T>,
    updateData: Partial<T>,
  ): Promise<T | undefined>;
}
