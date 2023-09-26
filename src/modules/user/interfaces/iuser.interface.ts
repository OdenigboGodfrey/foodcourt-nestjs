import { USER_TYPE } from '../enums/user.enum';

export interface IUser {
  id?: number;
  email: string;
  phone: string;
  password: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  homeAddress?: string;
  status?: string;
  userType: USER_TYPE;
  roles?: string[];
  additionalContact?: string;
  otp?: string;
  otpCreatedAt?: Date;
  otpReason?: string;
  emailVerifiedDate?: Date;
  // facebookId: string;
  // appleId: string;
}

export interface IChangePassword {
  id: number;
  password: string;
  newPassword: string;
}

export interface IEditUser {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date;
  homeAddress?: string;
  id: number;
  bvn?: string;
}

export interface IForgotPassword {
  id: number;
  type: 'phone' | 'email';
}

export interface IVerifyPasswordResetToken {
  id: number;
  token: string;
}

export interface IResetPassword {
  id: number;
  password: string;
  token: string;
}
