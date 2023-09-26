import { Module } from '@nestjs/common';
import { MealController } from './controllers/meal.controller';
import { AddonService } from './services/addon.service';
import { MealRepository } from './repository/meal.repository';
import { MealService } from './services/meal.service';
import { BrandRepository } from './repository/brand.repository';
import { AddonController } from './controllers/addon.controller';
import { BrandController } from './controllers/brand.controller';
import { BrandService } from './services/brand.service';

@Module({
  controllers: [MealController, AddonController, BrandController],
  providers: [
    MealService,
    AddonService,
    BrandService,
    {
      provide: 'MealRepositoryInterface',
      useClass: MealRepository,
    },
    {
      provide: 'AddonRepositoryInterface',
      useClass: MealRepository,
    },
    {
      provide: 'BrandRepositoryInterface',
      useClass: BrandRepository,
    },
  ],
  exports: [MealService],
})
export class MealModule {}
