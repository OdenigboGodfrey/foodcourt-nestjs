import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ResponseDTO } from '../../../shared/dto/response.dto';
import {
  BasicUserDTO,
  ChangePasswordDTO,
  EditUserDTO,
  UserDTO,
} from '../dtos/user.dto';
import { USER_TYPE } from '../enums/user.enum';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  PaginationParameterDTO,
  PaginationParameterRequestDTO,
  PaginationParameterResponseDTO,
} from '../../../shared/dto/pagination.dto';
import { HttpCacheInterceptor } from '../../../shared/interceptors/custom-cache-interceptor.service';

@ApiTags('user')
@Controller('user')
@UseInterceptors(HttpCacheInterceptor)
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    description: 'Create a new  account',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: UserDTO,
  })
  @Post('/')
  @ApiBody({ type: BasicUserDTO })
  async create(@Body() data: BasicUserDTO): Promise<ResponseDTO<UserDTO>> {
    const userObject = new UserDTO(data);
    userObject.userType = USER_TYPE.customer;
    userObject.roles = [];

    const response = await this.service.createUser(userObject);
    data.password = '';
    console.log('create user response', response);
    return response.getResponse();
  }

  @ApiOperation({
    description: 'get all users by  user type',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: UserDTO,
    isArray: true,
  })
  @Get('/get-all/')
  async getUsers(
    @Query() userType: USER_TYPE,
    @Query() pagination: PaginationParameterRequestDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<UserDTO>>> {
    const result = await this.service.getAllUsersByUserType(
      userType,
      new PaginationParameterDTO(pagination),
    );
    const response = new ResponseDTO<PaginationParameterResponseDTO<UserDTO>>({
      status: result.status,
      message: result.message,
      code: result.code,
    });
    response.data = new PaginationParameterResponseDTO<UserDTO>({
      count: result.data.count,
      totalPages: result.data.totalPages,
    });
    if (result.data.rows) {
      response.data.rows = result.data.rows.map((x) =>
        this.service.newUserDTO(x),
      );
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'update a  profile',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Patch('/update-profile')
  @ApiBody({ type: EditUserDTO })
  async updateProfile(
    @Body() data: EditUserDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    const user = await this.service.getUserById(data.id);
    if (!user.status) {
      response.status = user.status;
      response.data = user.status;
      response.message = user.message;
      response.code = user.code;
      return response.getResponse();
    }
    const updateResponse = await this.service.updateProfile(user.data, data);
    return updateResponse.getResponse();
  }

  @ApiOperation({
    description: 'update a user password',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Patch('/update-password')
  @ApiBody({ type: ChangePasswordDTO })
  async changePassword(
    @Body() data: ChangePasswordDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    const user = await this.service.getUserById(data.id);
    if (!user.status) {
      response.status = user.status;
      response.data = user.status;
      response.message = user.message;
      response.code = user.code;
      return response.getResponse();
    }
    const updateResponse = await this.service.changePassword(
      user.data,
      data.oldPassword,
      data.password,
    );
    return updateResponse.getResponse();
  }

  @ApiOperation({
    description: 'get user by id',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: UserDTO,
  })
  @Get('/get-user-by-id/:id')
  async getById(@Param('id') id: number): Promise<ResponseDTO<UserDTO>> {
    const result = await this.service.getUserById(id);
    const response = new ResponseDTO<UserDTO>();
    response.message = result.message;
    response.code = result.code;
    response.message = result.message;
    response.status = result.status;
    if (result.status) {
      response.data = this.service.newUserDTO(result.data);
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'delete  account',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: Boolean,
  })
  @Delete('/delete-account/:userId')
  async deleteAccount(
    @Param('userId') userId: number,
  ): Promise<ResponseDTO<boolean>> {
    const result = await this.service.getUserById(userId);
    const response = new ResponseDTO<boolean>();
    response.message = result.message;
    response.code = result.code;
    response.message = result.message;
    response.status = result.status;
    if (result.status) {
      const deleteResult = await this.service.delete(result.data);
      response.message = 'Profile deleted';
      response.data = deleteResult.data;
      response.code = deleteResult.code;
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'update a user role',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Patch('/update-user-role/:id')
  @ApiBody({ isArray: true })
  async updateRoles(
    @Param('id') id: number,
    @Body() data: [],
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    const user = await this.service.getUserById(id);
    if (!user.status) {
      response.status = user.status;
      response.data = user.status;
      response.message = user.message;
      response.code = user.code;
      return response.getResponse();
    }
    const updateResponse = await this.service.updateUserRole(user.data, data);
    return updateResponse.getResponse();
  }
}
