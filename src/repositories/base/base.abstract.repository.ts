/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { BaseInterfaceRepository } from './base.interface.repository';
import { Model, QueryBuilder } from 'objection';

@Injectable()
export class BaseAbstractRepository<T extends Model>
  implements BaseInterfaceRepository<T>
{
  constructor() {}
  create = async (entityModel: new () => T, data) =>
    entityModel['query']().insert(data);
  findOneById = async (entityModel: new () => T, id) =>
    entityModel['query']().findById(id);
  findByCondition = async (entityModel: new () => T, filterCondition) =>
    entityModel['query']().where(filterCondition);
  findOneByCondition = async (entityModel: new () => T, filterCondition) =>
    entityModel['query']().where(filterCondition).first();
  findAll = async (entityModel: new () => T) => entityModel['query']();
  remove = async (entityModel: new () => T, id) =>
    entityModel['query']().deleteById(id);
  findOneWhere = async (entityModel: new () => T, filterCondition) =>
    entityModel['query']().where(filterCondition).first();
  findWhere = async (entityModel: new () => T, filterCondition) =>
    entityModel['query']().where(filterCondition);
  UpdateOne = async (entityModel: new () => T, id, data) =>
    entityModel['query']().updateAndFetchById(id, data);
  createBulk = async (entityModel: new () => T, data) => {
    const result = await entityModel['query']().insert(data);
    return { inserted: result.length, data: result };
  };
  count = async (entityModel: new () => T, filterCondition) =>
    entityModel['query']()
      .count()
      .where(filterCondition)
      .first()
      .then((result) => (result ? parseInt(result.count) : 0));
  query = (entityModel: new () => T) => entityModel['query']();
  upsert = async (entityModel: new () => T, data, updateData) => {
    return entityModel['query']().upsertGraphAndFetch(data, {
      noUpdate: updateData,
    });
  };
}
