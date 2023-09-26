import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('user_id');
    table.boolean('completed');
    table.boolean('cancelled');
    table.jsonb('meals');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
