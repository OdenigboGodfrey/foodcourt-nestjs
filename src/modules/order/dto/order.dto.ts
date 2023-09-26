import { ApiProperty } from '@nestjs/swagger';
import { MealRequestDTO } from './../../../modules/meal/dto/meal.dto';
import { CalculatedOrderDTO } from './calculated-order.dto';
import { OrderLogDTO } from './order-log.dto';

export class OrderDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  user_id: number;
  @ApiProperty({ default: false })
  completed: boolean;
  @ApiProperty({ default: false })
  cancelled: boolean;
  @ApiProperty()
  meals: number[];
}

export class BasicOrderDTO {
  @ApiProperty()
  user_id: number;
  @ApiProperty({ default: false })
  completed: boolean;
  @ApiProperty({ default: false })
  cancelled: boolean;
}

export class NewOrderRequestDTO {
  @ApiProperty()
  user_id: number;
  @ApiProperty({ isArray: true, type: MealRequestDTO })
  meals: MealRequestDTO[];
}

export class NewOrderResponseDTO {
  @ApiProperty()
  user_id: number;
  @ApiProperty({ isArray: true, type: MealRequestDTO })
  meals: MealRequestDTO[];
  @ApiProperty()
  calculateOrder: CalculatedOrderDTO;
  @ApiProperty({ isArray: true, type: OrderLogDTO })
  orderLog: OrderLogDTO[];
  @ApiProperty()
  order: OrderDTO;
}
