/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserDTO } from '../../../dtos/user.dto';
import { USER_TYPE } from '../../../enums/user.enum';
import { MockRepo } from '../../../../../../test/mocks/repo.mock';
import { UserService } from '../../user.service';
import { UserController } from '../../../controllers/user.controller';
// import { JwtService } from '@nestjs/jwt';
import { AppModule } from './../../../../../app.module';
import * as dotenv from 'dotenv';
import { PERMISSIONS } from './../../../../../shared/enums/permissions.enum';
dotenv.config();
jest.useFakeTimers();
// import { CACHE_MANAGER, CACHE_MODULE_OPTIONS } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';

const JwtService = () => {
  return true;
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
  const mockPractitionerInformation = {
    specializationId: 1,
    location: '0.0:1.1',
    rating: 3,
    experience: 1,
    about: 'test information about',
    higherInstitution: 'MDX University',
    yearOfGraduation: '2020-08-22T06:26:17.325Z',
    residencyInfo: 'Residency in abj',
    boardCertifications: 'Certified on 20th',
    yearOfCompletetion: '2020-08-22T06:26:17.325Z',
    workHistory: '3 yrs',
    clinicalInterests: 'surgery',
    licenseNo: '12345678',
    licenseState: 'Abj',
    regulatoryComplaince: 'yes',
    affiliations: 'n/a',
    arearsOfSpecialization: 'eyes, nose and skin',
  };
  // let jwtService: JwtService;
  let jwtService;
  let authToken: string;

  beforeEach(async () => {
    process.env['SECRET_KEY'] = '0000000';
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
          provide: 'CACHE_MANAGER',
          useValue: {},
        },
        {
          provide: 'AuditLogService',
          useValue: {
            emitAuditLog: (eventEmitter, payload) => {
              eventEmitter.emit = () => {};
            },
          },
        },
      ],
    })
      .overrideProvider('CACHE_MODULE_OPTIONS')
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // jwtService = moduleFixture.get<JwtService>(JwtService);
    authToken = jwtService.sign(userData, { secret: process.env.SECRET_KEY });
  });

  afterEach(async () => {
    await app.close();
  });

  describe('create user', () => {
    it('should create a new patient user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create-patient')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data['dataValues'].id).toBeDefined();
    });
    it('should failed to create a new patient user', async () => {
      const mockError = new Error('Some error');
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/create-patient')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body.data).toEqual(null);
    });
    it('should failed to create a new patient user due to duplicate error', async () => {
      const mockError = new Error('Some error');
      mockError['name'] = 'SequelizeUniqueConstraintError';
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/create-patient')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.data).toEqual(null);
    });

    it('should create a new practitioner user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/create-physician')
        .send({
          userInfo: userData,
          practitionerInfo: mockPractitionerInformation,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data['dataValues'].id).toBeDefined();
    });
    it('should failed to create a new practitioner user', async () => {
      const mockError = new Error('Some error');
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/create-physician')
        .send({
          userInfo: userData,
          practitionerInfo: mockPractitionerInformation,
        });

      expect(response.status).toBe(500);
      expect(response.body.data).toEqual(null);
    });
    it('should failed to create a new practitioner user due to duplicate error', async () => {
      const mockError = new Error('Some error');
      mockError['name'] = 'SequelizeUniqueConstraintError';
      serviceMockRepo.create = jest.fn().mockRejectedValue(mockError);
      const response = await request(app.getHttpServer())
        .post('/user/create-physician')
        .send({
          userInfo: userData,
          practitionerInfo: mockPractitionerInformation,
        });

      expect(response.status).toBe(409);
      expect(response.body.data).toEqual(null);
    });
  });

  describe('get all users by usertype', () => {
    it('should retrieve patient users by user type', async () => {
      serviceMockRepo.findByCondition = async (
        entityModel: any,
        filterCondition: any,
      ) => {
        return [{ dataValues: userData }];
      };
      const userType = USER_TYPE.customer;
      const response = await request(app.getHttpServer())
        .get(`/user/get-all-users-by-usertype/${userType}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data']['rows'][0].email).toBeDefined();
    });
    it('should not retrieve any patient user by user type', async () => {
      const userType = USER_TYPE.customer;
      serviceMockRepo.findByCondition = async (
        entityModel,
        filterCondition,
      ): Promise<any> => {
        return [];
      };

      const response = await request(app.getHttpServer())
        .get(`/user/get-all-users-by-usertype/${userType}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data['rows']).toBeDefined();
      expect(response.body.data['count']).toBe(1);
      expect(response.body.data['totalPages']).toBe(1);
    });
    it('should not retrieve any patient user by user type', async () => {
      const userType = USER_TYPE.customer;
      serviceMockRepo.findByCondition = async (
        entityModel,
        filterCondition,
      ): Promise<any> => {
        throw new Error('Some Error');
      };

      const response = await request(app.getHttpServer())
        .get(`/user/get-all-users-by-usertype/${userType}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe('should update user profile', () => {
    it('should update patient profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-patient-profile/`)
        .set('Authorization', `Bearer ${authToken}`)
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
    it('should fail to find user while updating patient profile', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-patient-profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: '1',
          fullName: 'test full name',
          gender: 'female',
          homeAddress: '987 test city',
        });
      expect(response.status).toBe(404);
    });
    it('should fail while updating patient profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      serviceMockRepo.UpdateOne = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-patient-profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: '1',
          fullName: 'test full name',
          gender: 'female',
          homeAddress: '987 test city',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('get patient user by id', () => {
    it('should retrieve patient user by id', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return { dataValues: { ...userData, ...{ userType: 'patient' } } };
      };
      const response = await request(app.getHttpServer())
        .get(`/user/get-patient-by-id/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data'].email).toBeDefined();
    });
    it('should fail to retrieve user by id', async () => {
      serviceMockRepo.findOneByCondition = (entityModel, filterCondition) => {
        return null;
      };

      const response = await request(app.getHttpServer())
        .get(`/user/get-patient-by-id/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
    it('should crash on retrieve user by id', async () => {
      serviceMockRepo.findOneByCondition = (entityModel, filterCondition) => {
        throw new Error('some error');
      };

      const response = await request(app.getHttpServer())
        .get(`/user/get-patient-by-id/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe('should change user password', () => {
    it('should update user passwrd', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body['data']).toBe(true);
    });
    it('should fail to find user while updating patient password', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });
      expect(response.status).toBe(404);
    });
    it('should fail while updating patient password', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      serviceMockRepo.UpdateOne = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer())
        .patch(`/user/update-password/`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: '1',
          oldPassword: 'test',
          password: 'new_test',
        });

      expect(response.status).toBe(500);
    });
  });

  describe('should delete patient account', () => {
    it('should delete patient account', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      userData.userType = USER_TYPE.customer;
      authToken = jwtService.sign(userData, { secret: process.env.SECRET_KEY });
      const response = await request(app.getHttpServer())
        .delete(`/user/delete-patient-account/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
    it('should fail to find user while updating patient profile', async () => {
      serviceMockRepo.findOneByCondition = () => {
        return null;
      };
      userData.userType = USER_TYPE.customer;
      authToken = jwtService.sign(userData, { secret: process.env.SECRET_KEY });
      const response = await request(app.getHttpServer())
        .delete(`/user/delete-patient-account/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(404);
    });
    it('should fail while updating patient profile', async () => {
      serviceMockRepo.findOneByCondition = (
        entityModel: any,
        filterCondition: any,
      ) => {
        return {
          dataValues: { ...userData, ...{ userType: USER_TYPE.customer } },
        };
      };
      userData.userType = USER_TYPE.customer;
      authToken = jwtService.sign(userData, { secret: process.env.SECRET_KEY });
      serviceMockRepo.remove = () => {
        throw new Error('Some Error');
      };
      const response = await request(app.getHttpServer())
        .delete(`/user/delete-patient-account/${userData.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
    });
  });
});
