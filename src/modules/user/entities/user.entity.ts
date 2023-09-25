import { Model } from 'objection';
import { IUser } from '../interfaces/iuser.interface';
import { USER_TYPE } from '../enums/user.enum';

class User extends Model implements IUser {
  id!: number;
  email!: string;
  phone!: string;
  password!: string;
  fullName!: string;
  gender!: string;
  dateOfBirth!: Date;
  homeAddress!: string;
  status!: string;
  userType!: USER_TYPE;
  roles!: string[];
  additionalContact!: string;
  otp!: string;
  otpCreatedAt!: Date;
  otpReason!: string;
  emailVerifiedDate!: Date;
  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: [
      'email',
      'phone',
      'password',
      'fullName',
      'gender',
      'dateOfBirth',
      'homeAddress',
      'status',
      'userType',
      'roles',
      'additionalContact',
      'otp',
      'otpCreatedAt',
      'otpReason',
      'emailVerifiedDate',
    ],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email', maxLength: 255 },
      phone: { type: 'string', maxLength: 20 },
      password: { type: 'string', minLength: 6, maxLength: 255 },
      fullName: { type: 'string', maxLength: 255 },
      gender: { type: 'string', maxLength: 20 },
      dateOfBirth: { type: 'string', format: 'date' },
      homeAddress: { type: 'string', maxLength: 255 },
      status: { type: 'string', maxLength: 20 },
      userType: { type: 'string', enum: ['admin', 'user'] },
      roles: { type: 'array', items: { type: 'string' } },
      additionalContact: { type: 'string', maxLength: 255 },
      otp: { type: 'string', maxLength: 255 },
      otpCreatedAt: { type: 'string', format: 'date-time' },
      otpReason: { type: 'string', maxLength: 255 },
      emailVerifiedDate: { type: 'string', format: 'date-time' },
    },
  };
}

export { User };
