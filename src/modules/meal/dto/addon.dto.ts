import { ApiProperty } from '@nestjs/swagger';

export class AddonDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  meal_id: number;
}

export class BasicAddonDTO {
  @ApiProperty()
  meal_id: number;
}
