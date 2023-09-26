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
import { BrandService } from '../services/brand.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BasicBrandDTO, BrandDTO } from '../dto/brand.dto';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { RESPONSE_CODE } from 'src/shared/enums/response-code.enum';

@Controller('brand')
@ApiTags('brand')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: BrandDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    payload: BasicBrandDTO,
  ) {
    const response = new ResponseDTO<BrandDTO>({
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
    updatedData: BrandDTO,
  ) {
    return this.service.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
