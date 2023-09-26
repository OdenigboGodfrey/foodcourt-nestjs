import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { RESPONSE_CODE } from 'src/shared/enums/response-code.enum';
import { OrderTypeService } from '../services/order-type.service';
import { BasicOrderTypeDTO, OrderTypeDTO } from '../dto/order-type.dto';
import { OrderType } from '../entities/order-type.entity';

@Controller('order-type')
@ApiTags('order-type')
export class OrderTypeController {
  constructor(private readonly orderService: OrderTypeService) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: OrderTypeDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    orderData: BasicOrderTypeDTO,
  ) {
    const response = new ResponseDTO<OrderTypeDTO>({
      message: this.basicErrorMessage,
    });
    const result = await this.orderService.create(orderData);
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
    return this.orderService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.orderService.getById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    updatedData: Partial<OrderType>,
  ) {
    return this.orderService.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
