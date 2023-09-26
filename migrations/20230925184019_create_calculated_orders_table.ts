import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('calculated_orders', (table) => {
    table.increments('id').primary();
    table.float('total_amount');
    table.boolean('free_delivery');
    table.float('delivery_fee');
    table.integer('order_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calculated_orders');
}
