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
import { CalculatedOrderService } from '../services/calculated-order.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { CalculatedOrderDTO } from '../dto/calculated-order.dto';
import { RESPONSE_CODE } from 'src/shared/enums/response-code.enum';

@Controller('calculated-orders')
@ApiTags('calculated-orders')
export class CalculatedOrderController {
  constructor(
    private readonly calculatedOrderService: CalculatedOrderService,
  ) {}

  basicErrorMessage = 'Something went wrong, please try again.';
  basicOkMessage = 'Ok';

  // validator: JoiValidationPipe
  @ApiOperation({
    description: 'Create a new record',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: CalculatedOrderDTO,
  })
  @Post()
  async createCalculatedOrder(
    @Body(new ValidationPipe({ transform: true }))
    calculatedOrderData: CalculatedOrderDTO,
  ) {
    const response = new ResponseDTO<CalculatedOrderDTO>({
      message: this.basicErrorMessage,
    });
    const result =
      await this.calculatedOrderService.create(calculatedOrderData);
    if (result) {
      response.data = result;
      response.status = true;
      response.code = RESPONSE_CODE._201;
      response.message = this.basicOkMessage;
    }

    return response.getResponse();
  }

  @Get()
  async getAllCalculatedOrders() {
    const response = new ResponseDTO<CalculatedOrderDTO[]>({
      message: this.basicErrorMessage,
    });
    const result = await this.calculatedOrderService.getAll();

    if (result) {
      response.data = result;
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.message = this.basicOkMessage;
    }

    return response.getResponse();
  }

  @Get(':id')
  async getCalculatedOrderById(@Param('id') id: number) {
    const response = new ResponseDTO<CalculatedOrderDTO>({
      message: this.basicErrorMessage,
    });
    const result = await this.calculatedOrderService.getById(id);
    if (result) {
      response.data = result;
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.message = this.basicOkMessage;
    }
    return response.getResponse();
  }

  @Put(':id')
  async updateCalculatedOrder(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    updatedData: CalculatedOrderDTO,
  ) {
    const response = new ResponseDTO<CalculatedOrderDTO>({
      message: this.basicErrorMessage,
    });
    const result = await this.calculatedOrderService.update(id, updatedData);
    if (result) {
      response.data = result;
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.message = this.basicOkMessage;
    }
    return response;
  }

  @Delete(':id')
  async deleteCalculatedOrder(@Param('id') id: number) {
    const response = new ResponseDTO<boolean>({
      message: this.basicErrorMessage,
    });
    const result = await this.calculatedOrderService.delete(id);
    if (result) {
      response.data = true;
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.message = this.basicOkMessage;
    }
    return response;
  }
}
