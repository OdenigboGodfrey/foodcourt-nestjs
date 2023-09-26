import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EditUserDTO, UserDTO } from '../dtos/user.dto';
import { ResponseDTO } from './../../../shared/dto/response.dto';
import { RESPONSE_CODE } from './../../../shared/enums/response-code.enum';
import { ErrorClass } from './../../../shared/dto/error-class.dto';
import { USER_TYPE } from '../enums/user.enum';
import * as bcrypt from 'bcrypt';
import { saltRounds, transformValue } from './../../../shared/utils';
import {
  PaginationParameterDTO,
  PaginationParameterResponseDTO,
} from './../../../shared/dto/pagination.dto';
import { OTPTokenType } from '../types/otp-token.type';
import { UserRepositoryInterface } from '../repository/user.repository';
// import { PERMISSIONS } from './../../../shared/enums/permissions.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly repository: UserRepositoryInterface,
  ) {}

  private logger = {
    error: (...args) => {
      console.error(args);
    },
    info: (...args) => {
      console.log(args);
    },
  };

  public newUserDTO(user: User): UserDTO {
    return { ...user };
  }

  async createUser(payload: UserDTO): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const user = await this.repository.create(User, payload);
      response.data = user;
      response.status = true;
      response.message = 'User account created.';
      response.code = RESPONSE_CODE._201;
    } catch (e) {
      const errorObject: ErrorClass<any> = {
        payload,
        error: e['errors'],
        response: null,
      };
      response.message = 'Something went wrong, please try again.';
      response.code = RESPONSE_CODE._500;
      if (typeof e === 'object') {
        if (e['name'] === 'SequelizeUniqueConstraintError') {
          response.message =
            'Please ensure email or phone has not been used to open an existing account.';
          response.code = RESPONSE_CODE._409;
          errorObject.error = e['parent'];
        }
      }
      errorObject.response = response;
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getAllUsersByUserType(
    userType: USER_TYPE,
    pagination: PaginationParameterDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<User>>> {
    const response = new ResponseDTO<PaginationParameterResponseDTO<User>>();
    response.code = RESPONSE_CODE._200;
    response.message = 'No records found.';
    try {
      const paginationResponse = new PaginationParameterResponseDTO<User>();
      paginationResponse.rows = [];
      response.data = paginationResponse;

      const query = pagination.buildQuery({ userType });

      const result = await pagination.fetchPaginatedRecords<User>(
        User,
        this.repository,
        {
          query: query.where,
          sort: query.order,
        },
      );

      if (result && result.length > 0) {
        paginationResponse.rows = result;
        paginationResponse.count = await pagination.count(
          User,
          this.repository,
          query.where,
        );
        paginationResponse.totalPages = pagination.totalPages({
          count: paginationResponse.count,
        });
        response.data = paginationResponse;
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.message = 'Records fetched.';
      }
    } catch (e) {
      console.error('function', e);
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getAllUsersByMultipleUserTypes(
    userTypes: USER_TYPE[],
    pagination: PaginationParameterDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<User>>> {
    const response = new ResponseDTO<PaginationParameterResponseDTO<User>>();
    response.code = RESPONSE_CODE._200;
    response.message = 'No records found.';
    try {
      const paginationResponse = new PaginationParameterResponseDTO<User>();
      paginationResponse.rows = [];

      const query = pagination.buildQuery({
        or: {
          // [Op.or]: userTypes.map((x) => {
          //   return { userType: x };
          // }),
        },
      });
      // extract query conditions
      // const orQuery = query['where']['or'];
      delete query['where']['or'];
      const otherQuery = query['where'];

      const newQuery = {
        // [Op.or]: orQuery,
        ...otherQuery,
      };
      const result = await pagination.fetchPaginatedRecords<User>(
        User,
        this.repository,
        {
          query: newQuery,
          sort: query.order,
        },
      );

      if (result && result.length > 0) {
        paginationResponse.rows = result;
        paginationResponse.count = await pagination.count(
          User,
          this.repository,
          newQuery,
        );
        paginationResponse.totalPages = pagination.totalPages({
          count: paginationResponse.count,
        });
        response.data = paginationResponse;
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.message = 'Records fetched.';
      }
    } catch (e) {
      console.error('function', e);
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.repository.findOneByCondition(User, {
        email: login,
      });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User not found.';
        return response;
      } else {
        if (await bcrypt.compareSync(password, result.password)) {
          response.status = true;
          response.code = RESPONSE_CODE._200;
          response.data = result;
        } else {
          response.code = RESPONSE_CODE._404;
          response.message = 'User not found.';
          return response;
        }
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserByEmail(email: string): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.repository.findOneByCondition(User, {
        email,
      });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User with the supplied email not found.';
        return response;
      } else {
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.data = result;
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserById(id: number): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.repository.findOneByCondition(User, {
        id,
      });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User id not found .';
      } else {
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.data = result;
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async writeOTP(
    user: User,
    token: string,
    tokenType: OTPTokenType,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      const currentDate = transformValue('datetime', new Date());
      // write otp
      this.repository.UpdateOne(User, user.id, {
        otp: token,
        otpCreatedAt: currentDate,
        otpReason: tokenType,
      });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async clearOTP(user: User): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // write otp
      this.repository.UpdateOne(User, user.id, {
        otp: '',
        otpCreatedAt: null,
        otpReason: '',
      });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updateEmailVerifiedDate(
    user: User,
    date: Date,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      const transformedDate = transformValue('datetime', date);
      // write otp
      this.repository.UpdateOne(User, user.id, {
        emailVerifiedDate: transformedDate,
      });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updatePassword(
    user: User,
    password: string,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      // update password
      this.repository.UpdateOne(User, user.id, {
        password: hashedPassword,
      });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updatePatientProfile(
    user: User,
    payload: EditUserDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // write otp
      this.repository.UpdateOne(User, user.id, payload);
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<EditUserDTO> = {
        payload: payload,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async changePassword(
    user: User,
    oldPassword: string,
    password: string,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      if (await bcrypt.compareSync(oldPassword, user.password)) {
        return await this.updatePassword(user, password);
      } else {
        response.code = RESPONSE_CODE._400;
        response.message = 'old Password incorrect.';
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async delete(user: User): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // update password
      this.repository.remove(User, user.id);
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updateUserRole(user: User, roles: []): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // update user role
      this.repository.UpdateOne(User, user.id, {
        roles: roles as any as string[],
      });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }
}
