import { Model } from 'objection';

export class Meal extends Model {
  static get tableName() {
    return 'meals';
  }

  id!: number;
  name: string;
  brand_id: number;
  active: boolean;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        brand_id: { type: 'integer' },
        active: { type: 'boolean' },
      },
    };
  }
}
