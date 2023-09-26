import { Model } from 'objection';

export class CalculatedOrder extends Model {
  static get tableName() {
    return 'calculated_orders';
  }

  id: number;
  total_amount: number;
  free_delivery: boolean;
  delivery_fee: number;
  order_id: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        total_amount: { type: 'number' },
        free_delivery: { type: 'boolean' },
        delivery_fee: { type: 'number' },
        order_id: { type: 'number' },
      },
    };
  }
}
