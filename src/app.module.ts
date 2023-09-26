import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealModule } from './modules/meal/meal.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';
import { BullModule } from '@nestjs/bull';

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
    BullModule.forRoot({
      redis: {
        host: `${process.env.REDIS_HOST || 'localhost'}`,
        port: (process.env.REDIS_PORT as any as number) || 6379,
      },
    }),
    OrderModule,
    MealModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
