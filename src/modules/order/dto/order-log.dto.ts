import { ApiProperty } from '@nestjs/swagger';

export class OrderLogDTO {
  @ApiProperty()
  Id?: number;
  @ApiProperty()
  time: string;
  @ApiProperty()
  description: string;
}

export class BasicOrderLogDTO {
  @ApiProperty()
  time: string;
  @ApiProperty()
  description: string;
}
