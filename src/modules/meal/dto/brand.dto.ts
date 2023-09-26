import { ApiProperty } from '@nestjs/swagger';

export class BrandDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

export class BasicBrandDTO {
  @ApiProperty()
  name: string;
}
