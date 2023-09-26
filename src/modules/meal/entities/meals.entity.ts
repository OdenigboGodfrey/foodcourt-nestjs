import { Model } from 'objection';

export class Meal extends Model {
  static get tableName() {
    return 'meals';
  }

  id: number;
  name: string;
  brand_id: number;
  active: boolean;
  amount: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        brand_id: { type: 'number' },
        active: { type: 'boolean' },
        amount: { type: 'number' },
      },
    };
  }
}
