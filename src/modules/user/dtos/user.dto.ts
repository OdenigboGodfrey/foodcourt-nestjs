import {
  IUser,
  IChangePassword,
  IForgotPassword,
  IVerifyPasswordResetToken,
  IResetPassword,
} from '../interfaces/iuser.interface';
import { USER_TYPE } from '../enums/user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO implements IUser {
  public constructor(init?: Partial<UserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  additionalContact: string;
  @ApiProperty()
  id?: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  dateOfBirth: Date;
  @ApiProperty()
  homeAddress: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  userType: USER_TYPE;
  @ApiProperty()
  roles: string[];
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  deletedAt?: Date;
  @ApiProperty()
  otpCreatedAt: Date;
  @ApiProperty()
  otp: string;
  @ApiProperty()
  otpReason: string;
  @ApiProperty()
  emailVerifiedDate: Date;
}

export class UserPasswordDTO implements IChangePassword {
  public constructor(init?: Partial<UserPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  password: string;
  newPassword: string;
}

export class EditUserDTO {
  public constructor(init?: Partial<EditUserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  homeAddress: string;
}

export class ForgotPasswordDTO implements IForgotPassword {
  public constructor(init?: Partial<ForgotPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  type: 'email' | 'phone';
}

export class VerifyPasswordResetTokenDTO implements IVerifyPasswordResetToken {
  public constructor(init?: Partial<VerifyPasswordResetTokenDTO>) {
    Object.assign(this, init);
  }
  id: number;
  token: string;
}

export class ResetPasswordDTO implements IResetPassword {
  public constructor(init?: Partial<ResetPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  password: string;
  token: string;
}

export class ChangePasswordDTO {
  public constructor(init?: Partial<ChangePasswordDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  password: string;
  @ApiProperty()
  oldPassword: string;
}

export type BasicUserType = Pick<
  UserDTO,
  'email' | 'phone' | 'password' | 'fullName' | 'gender' | 'dateOfBirth'
>;

export class BasicUserDTO implements BasicUserType {
  public constructor(init?: Partial<BasicUserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  dateOfBirth: Date;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
}
