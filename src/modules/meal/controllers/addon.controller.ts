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
import { AddonService } from '../services/addon.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BasicAddonDTO, AddonDTO } from '../dto/addon.dto';
import { ResponseDTO } from './../../../shared/dto/response.dto';
import { RESPONSE_CODE } from './../../../shared/enums/response-code.enum';

@Controller('addon')
@ApiTags('addon')
export class AddonController {
  constructor(private readonly service: AddonService) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: AddonDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    payload: BasicAddonDTO,
  ) {
    const response = new ResponseDTO<AddonDTO>({
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
    updatedData: AddonDTO,
  ) {
    return this.service.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
