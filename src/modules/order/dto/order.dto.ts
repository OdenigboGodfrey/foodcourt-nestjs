import { ApiProperty } from '@nestjs/swagger';

export class OrderDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  user_id: number;
  @ApiProperty({ default: false })
  completed: boolean;
  @ApiProperty({ default: false })
  cancelled: boolean;
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
  order: OrderDTO;
}
