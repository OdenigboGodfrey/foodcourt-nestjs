import { Model } from 'objection';

export class OrderType extends Model {
  static get tableName() {
    return 'order_types';
  }

  id!: number;
  name!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integers' },
        name: { type: 'string' },
      },
    };
  }
}
