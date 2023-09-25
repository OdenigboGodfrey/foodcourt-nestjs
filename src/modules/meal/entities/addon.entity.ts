import { Model } from 'objection';

export class Addon extends Model {
  static get tableName() {
    return 'addons';
  }

  id!: number;
  amount!: number;
  meal_id!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        amount: { type: 'decimal' },
        meal_id: { type: 'integer' },
      },
    };
  }
}
