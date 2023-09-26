import { Model } from 'objection';

export class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  id!: number;
  user_id!: number;
  completed!: boolean;
  cancelled!: boolean;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        completed: { type: 'boolean' },
        cancelled: { type: 'boolean' },
      },
    };
  }
}
