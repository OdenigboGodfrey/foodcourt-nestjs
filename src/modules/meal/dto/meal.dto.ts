import { ApiProperty } from '@nestjs/swagger';
import { BasicAddonDTO } from './addon.dto';

export class MealDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  brand_id: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  amount: number;
}

export class BasicMealDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  brand_id: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  amount: number;
}

export class MealRequestDTO {
  @ApiProperty()
  meal_id: number;
  @ApiProperty({ isArray: true, type: BasicAddonDTO })
  addons: BasicAddonDTO[];
}
