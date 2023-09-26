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
import { OrderLogService } from '../services/order-log.service';
import { OrderLog } from '../entities/order-log.entity';
import { OrderLogDTO } from '../dto/order-log.dto';

@Controller('order-log')
@ApiTags('order-log')
export class OrderLogController {
  constructor(private readonly orderService: OrderLogService) {}

  // validator: JoiValidationPipe
  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: OrderLogDTO,
  })
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    payload: OrderLogDTO,
  ) {
    return this.orderService.create(payload);
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
    updatedData: Partial<OrderLog>,
  ) {
    return this.orderService.update(id, updatedData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
