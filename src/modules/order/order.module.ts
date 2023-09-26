import { Module } from '@nestjs/common';
import { CalculatedOrderController } from './controllers/calculated-order.controller';
import { OrderService } from './services/order.service';
import { CalculatedOrderRepository } from './repository/calculated-order.repository';
import { OrderRepository } from './repository/order.repository';
import { CalculatedOrderService } from './services/calculated-order.service';
import { OrderController } from './controllers/order.controller';
import { OrderLogRepository } from './repository/order-log.repository';
import { OrderLogController } from './controllers/order-log.controller';
import { OrderLogService } from './services/order-log.service';

@Module({
  controllers: [CalculatedOrderController, OrderController, OrderLogController],
  providers: [
    OrderService,
    CalculatedOrderService,
    OrderLogService,
    {
      provide: 'CalculatedOrderRepositoryInterface',
      useClass: CalculatedOrderRepository,
    },
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'OrderLogRepositoryInterface',
      useClass: OrderLogRepository,
    },
  ],
})
export class OrderModule {}
