import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { NewOrderRequestDTO, NewOrderResponseDTO } from '../dto/order.dto';
import { ResponseDTO } from './../../../shared/dto/response.dto';
import { RESPONSE_CODE } from './../../../shared/enums/response-code.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectQueue('orders') private readonly queue: Queue,
  ) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: NewOrderResponseDTO,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    orderData: NewOrderRequestDTO,
  ) {
    this.queue
      .add('create', orderData)
      .then((result) => {
        console.log('queue result', result);
      })
      .catch((err) => console.error(err));
    const response = new ResponseDTO<NewOrderResponseDTO>({
      message: 'Order request recieved.',
      code: RESPONSE_CODE._201,
      status: true,
    });
    return response;
    // const result = await this.orderService.create(orderData);
    // if (result) {
    //   response.data = result;
    //   response.status = true;
    //   response.code = RESPONSE_CODE._201;
    //   response.message = this.basicOkMessage;
    // }
    // return response;
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

  @Patch('completed/:id')
  completed(@Param('id') id: number) {
    return this.orderService.markAsDone(id);
  }

  @Patch('cancel/:id')
  cancel(@Param('id') id: number) {
    return this.orderService.cancel(id);
  }
}
