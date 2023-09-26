import { ApiProperty } from '@nestjs/swagger';

export class CalculatedOrderDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  total_amount: number;
  @ApiProperty()
  free_delivery: boolean;
  @ApiProperty()
  delivery_fee: number;
  @ApiProperty()
  order_id: number;
}

export class BasicCalculatedOrderDTO {
  @ApiProperty()
  total_amount: number;
  @ApiProperty()
  free_delivery: boolean;
  @ApiProperty()
  delivery_fee: number;
  @ApiProperty()
  order_id: number;
}
