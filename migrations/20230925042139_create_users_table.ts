import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('password').notNullable();
    table.string('fullName').notNullable();
    table.string('gender').notNullable();
    table.date('dateOfBirth').notNullable();
    table.string('homeAddress').notNullable();
    table.string('status').notNullable();
    table.enum('userType', ['admin', 'user']).notNullable();
    table.json('roles').notNullable();
    table.string('additionalContact').notNullable();
    table.string('otp').notNullable();
    table.timestamp('otpCreatedAt').notNullable();
    table.string('otpReason').notNullable();
    table.timestamp('emailVerifiedDate').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
