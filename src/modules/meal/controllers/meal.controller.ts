import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDTO } from './../../../shared/dto/response.dto';
import { BasicMealDTO, MealDTO } from '../dto/meal.dto';
import { RESPONSE_CODE } from './../../../shared/enums/response-code.enum';
import { Meal } from '../entities/meals.entity';
import { MealService } from '../services/meal.service';

@Controller('meal')
@ApiTags('meal')
export class MealController {
  constructor(private readonly service: MealService) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: MealDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    payload: BasicMealDTO,
  ) {
    const response = new ResponseDTO<MealDTO>({
      message: this.basicErrorMessage,
    });
    const result = await this.service.create(payload);
    if (result) {
      response.data = result;
      response.status = true;
      response.code = RESPONSE_CODE._201;
      response.message = this.basicOkMessage;
    }
    return response;
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    updatedData: Partial<Meal>,
  ) {
    return this.service.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
