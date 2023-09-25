import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealModule } from './modules/meal/meal.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [OrderModule, MealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
