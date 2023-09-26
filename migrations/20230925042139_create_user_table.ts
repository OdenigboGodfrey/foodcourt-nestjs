import { Knex } from 'knex';
import { USER_TYPE } from './../src/modules/user/enums/user.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email');
    table.string('phone');
    table.string('password');
    table.string('fullName');
    table.string('gender');
    table.date('dateOfBirth');
    table.string('homeAddress');
    table.string('status');
    table.enum('userType', [
      USER_TYPE.customer.toString(),
      USER_TYPE.kitchen.toString(),
      USER_TYPE.rider.toString(),
    ]);
    table.json('roles');
    table.string('additionalContact');
    table.string('otp');
    table.timestamp('otpCreatedAt');
    table.string('otpReason');
    table.timestamp('emailVerifiedDate');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
