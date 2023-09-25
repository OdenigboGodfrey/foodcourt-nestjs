import { Model } from 'objection';

export class Brand extends Model {
  static get tableName() {
    return 'brands';
  }

  id!: number;
  name!: string;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
    };
  }
}
