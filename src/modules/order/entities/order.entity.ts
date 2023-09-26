import { Model } from 'objection';

export class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  id: number;
  user_id: number;
  completed: boolean;
  cancelled: boolean;
  meals: any;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'number' },
        user_id: { type: 'number' },
        completed: { type: 'boolean' },
        cancelled: { type: 'boolean' },
        meals: { type: 'jsonb' },
      },
    };
  }
}
