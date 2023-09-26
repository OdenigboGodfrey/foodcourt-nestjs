import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('brand_id');
    table.boolean('active');
    table.float('amount');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals');
}
