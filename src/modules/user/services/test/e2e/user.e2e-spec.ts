/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserDTO } from '../../../dtos/user.dto';
import { USER_TYPE } from '../../../enums/user.enum';
import { MockRepo } from '../../../../../../test/mocks/repo.mock';
import { UserService } from '../../user.service';
import { UserController } from '../../../controllers/user.controller';
import { AppModule } from './../../../../../app.module';
import * as dotenv from 'dotenv';
dotenv.config();
// jest.useFakeTimers();
import { CACHE_MANAGER, CACHE_MODULE_OPTIONS } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { assert } from 'console';
import { getQueueOptionsToken, getQueueToken } from '@nestjs/bull';
import { QueueOptions } from 'bull';

const JwtService = () => {
  return true;
};

const queueMock = {
  add: jest.fn(),
  process: jest.fn(),
  on: jest.fn(),
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let serviceMockRepo: MockRepo<UserDTO>;
  let userData: UserDTO;
  const userDataMock: UserDTO = {
    email: 'test@yahoo.com',
    phone: '08108766400',
    password: bcrypt.hashSync('test', 10),
    fullName: 'Test User',
    gender: 'Male',
    dateOfBirth: undefined,
    homeAddress: '',
    status: '',
    userType: USER_TYPE.customer,
    roles: [],
    additionalContact: '',
    otpCreatedAt: undefined,
    otp: '',
    otpReason: '',
    emailVerifiedDate: undefined,
    id: 1,
  };
  // let jwtService: JwtService;
  let jwtService;

  beforeEach(async () => {
    serviceMockRepo = new MockRepo<UserDTO>();
    userData = { ...userDataMock };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'WINSTON_MODULE_PROVIDER',
          useValue: {
            error: (msg: string, args: any) => {},
            info: (msg: string, args: any) => {},
            log: (msg: string, args: any) => {},
          },
        },
        {
          provide: 'UserRepositoryInterface',
          useValue: serviceMockRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    })
      .overrideProvider(CACHE_MODULE_OPTIONS)
      .useValue({})
      .overrideProvider(getQueueOptionsToken())
      .useValue(queueMock)
      .overrideProvider(getQueueToken('orders'))
      .useValue(queueMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create user', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/')
        .send(userData);
      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
      expect(response.body.data.id).toBeDefined();
    });
    it('should failed to create a new  user', async () => {
      const mockError = new Error('Some error');
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body.data).toEqual(null);
    });
    it('should failed to create a new  user due to duplicate error', async () => {
      const mockError = new Error('Some error');
      mockError['name'] = 'Error';
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.data).toEqual(null);
    });
  });

  describe('get all users by usertype', () => {
    it('should retrieve  users by user type', async () => {
      serviceMockRepo.findByCondition = async (
        entityModel: any,
        filterCondition: any,
      ) => {
        return [userData];
      };
      const userType = USER_TYPE.customer;
      const response = await request(app.getHttpServer()).get(`/user/get-all/`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data'][0].email).toBeDefined();
    });
    it('should not retrieve any  user by user type', async () => {
      const userType = USER_TYPE.customer;
      serviceMockRepo.findByCondition = async (
        entityModel,
        filterCondition,
      ): Promise<any> => {
        return [];
      };

      const response = await request(app.getHttpServer()).get(`/user/get-all/`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data['count']).toBe(1);
      expect(response.body.data['totalPages']).toBe(1);
    });
    it('should not retrieve any  user by user type', async () => {
      const userType = USER_TYPE.customer;
      serviceMockRepo.findByCondition = async (
        entityModel,
        filterCondition,
      ): Promise<any> => {
        throw new Error('Some Error');
      };

      const response = await request(app.getHttpServer()).get(`/user/get-all/`);

      expect(response.status).toBe(500);
    });
  });

  describe('should update user profile', () => {
    it('should update  profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-profile/`)
        .send({
          id: '1',
          fullName: 'test full name',
          gender: 'female',
          homeAddress: '987 test city',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data']).toBe(true);
    });
    it('should fail to find user while updating  profile', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-profile`)
        .send({
          id: '1',
          fullName: 'test full name',
          gender: 'female',
          homeAddress: '987 test city',
        });
      expect(response.status).toBe(404);
    });
    it('should fail while updating  profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      serviceMockRepo.UpdateOne = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-profile`)
        .send({
          id: '1',
          fullName: 'test full name',
          gender: 'female',
          homeAddress: '987 test city',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('get  user by id', () => {
    it('should retrieve  user by id', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: '' } };
      };
      const response = await request(app.getHttpServer()).get(
        `/user/get-user-by-id/${userData.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data'].email).toBeDefined();
    });
    it('should fail to retrieve user by id', async () => {
      serviceMockRepo.findOneByCondition = (entityModel, filterCondition) => {
        return null;
      };

      const response = await request(app.getHttpServer()).get(
        `/user/get-user-by-id/${userData.id}`,
      );

      expect(response.status).toBe(404);
    });
    it('should crash on retrieve user by id', async () => {
      serviceMockRepo.findOneByCondition = (entityModel, filterCondition) => {
        throw new Error('some error');
      };

      const response = await request(app.getHttpServer()).get(
        `/user/get-user-by-id/${userData.id}`,
      );

      expect(response.status).toBe(500);
    });
  });

  describe('should change user password', () => {
    it('should update user passwrd', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data']).toBe(true);
    });
    it('should fail to find user while updating  password', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });
      expect(response.status).toBe(404);
    });
    it('should fail while updating  password', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      serviceMockRepo.UpdateOne = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('should delete  account', () => {
    it('should delete  account', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      userData.userType = USER_TYPE.customer;
      const response = await request(app.getHttpServer()).delete(
        `/user/delete-account/${userData.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
    it('should fail to find user while updating  profile', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      userData.userType = USER_TYPE.customer;
      const response = await request(app.getHttpServer()).delete(
        `/user/delete-account/${userData.id}`,
      );
      expect(response.status).toBe(404);
    });
    it('should fail while updating  profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { ...userData, ...{ userType: USER_TYPE.customer } };
      };
      userData.userType = USER_TYPE.customer;
      serviceMockRepo.remove = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer()).delete(
        `/user/delete-account/${userData.id}`,
      );

      expect(response.status).toBe(500);
    });
  });
});
