import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryInterface } from '../repository/order.repository';
import { Order } from '../entities/order.entity';
import { NewOrderRequestDTO, NewOrderResponseDTO } from '../dto/order.dto';
import { MealService } from 'src/modules/meal/services/meal.service';
import { CalculatedOrderService } from './calculated-order.service';
import { OrderLogService } from './order-log.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly repository: OrderRepositoryInterface,
    private readonly calculateOrderService: CalculatedOrderService,
    private readonly orderLogService: OrderLogService,
    private readonly mealService: MealService,
  ) {}
  async create(orderData: NewOrderRequestDTO): Promise<NewOrderResponseDTO> {
    const response = new NewOrderResponseDTO();
    const order = new Order();

    const processOrderResult = await this.processOrder(orderData);

    order.user_id = orderData.user_id;
    order.meals = JSON.stringify(orderData.meals);

    response.order = await this.repository.create(Order, order);

    response.calculateOrder = await this.calculateOrderService.create({
      delivery_fee: 0,
      free_delivery: true,
      order_id: response.order.id,
      total_amount: processOrderResult.totalMealCost,
    });

    response.meals = orderData.meals;
    response.user_id = orderData.user_id;

    // make order as received
    response.orderLog = [
      await this.orderLogService.create({
        description: 'Order received in kitchen',
        time: new Date().toString(),
      }),
    ];

    return response;
  }

  async processOrder(orderData: NewOrderRequestDTO) {
    const totalMealCost = await this.mealService.calculateMealCost(
      orderData.meals,
    );
    const mealIds = orderData.meals.map((x) => x.meal_id);

    // update
    return { totalMealCost, mealIds };
  }

  async getAll(): Promise<Order[]> {
    return this.repository.findAll(Order);
  }

  async getById(id: number): Promise<Order> {
    return this.repository.findOneById(Order, id);
  }

  async update(id: number, updatedData: Partial<Order>): Promise<Order> {
    await this.repository.UpdateOne(Order, id, updatedData);
    return this.repository.findOneById(Order, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(Order, id);
  }

  async markAsDone(id: number): Promise<Order> {
    const data = await this.repository.findOneById(Order, id);
    data.completed = true;
    data.meals = JSON.stringify(data.meals);
    await this.repository.UpdateOne(Order, id, data);
    return data;
  }
  async cancel(id: number): Promise<Order> {
    const data = await this.repository.findOneById(Order, id);
    data.cancelled = true;
    data.meals = JSON.stringify(data.meals);
    await this.repository.UpdateOne(Order, id, data);
    return data;
  }
}
