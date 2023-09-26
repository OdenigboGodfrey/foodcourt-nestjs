import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealModule } from './modules/meal/meal.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      // global: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: `${process.env.REDIS_HOST || 'localhost'}`,
            port: (process.env.REDIS_PORT as any as number) || 6379,
          },
        }),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrderModule,
    MealModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
