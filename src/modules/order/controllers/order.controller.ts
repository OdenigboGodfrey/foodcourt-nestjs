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
// import { JoiValidationPipe } from 'src/shared/pipeline/joi-validation.pipeline';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { BasicOrderDTO, OrderDTO } from '../dto/order.dto';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { RESPONSE_CODE } from 'src/shared/enums/response-code.enum';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: OrderDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    orderData: BasicOrderDTO,
  ) {
    const response = new ResponseDTO<OrderDTO>({
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
    updatedData: Partial<Order>,
  ) {
    return this.orderService.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
