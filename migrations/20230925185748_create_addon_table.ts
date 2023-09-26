import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('addons', (table) => {
    table.increments('id').primary();
    table.float('amount');
    table.integer('meal_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('addons');
}
