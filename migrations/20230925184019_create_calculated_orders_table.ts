import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('calculated_orders', (table) => {
    table.increments('id').primary();
    table.decimal('total_amount');
    table.boolean('free_delivery');
    table.decimal('delivery_fee');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calculated_orders');
}
