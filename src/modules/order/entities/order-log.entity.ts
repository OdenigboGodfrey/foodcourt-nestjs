import { Model } from 'objection';

export class OrderLog extends Model {
  static get tableName() {
    return 'order_logs';
  }

  time!: string;
  description!: string;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        time: { type: 'string' },
        description: { type: 'string' },
      },
    };
  }
}
