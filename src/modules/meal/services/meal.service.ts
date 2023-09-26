import { Inject, Injectable } from '@nestjs/common';
import { Meal } from '../entities/meals.entity';
import { MealRepositoryInterface } from '../repository/meal.repository';
import { MealRequestDTO } from '../dto/meal.dto';

@Injectable()
export class MealService {
  constructor(
    @Inject('MealRepositoryInterface')
    private readonly repository: MealRepositoryInterface,
  ) {}
  async create(MealData: Partial<Meal>): Promise<Meal> {
    return this.repository.create(Meal, MealData);
  }

  async getAll(): Promise<Meal[]> {
    return this.repository.findAll(Meal);
  }

  async getById(id: number): Promise<Meal> {
    return this.repository.findOneById(Meal, id);
  }

  async update(id: number, updatedData: Partial<Meal>): Promise<Meal> {
    await this.repository.UpdateOne(Meal, id, updatedData);
    return this.repository.findOneById(Meal, id);
  }

  async delete(id: number): Promise<number> {
    return this.repository.remove(Meal, id);
  }

  async calculateMealCost(payload: MealRequestDTO[]) {
    let totalCost = 0;
    for (let index = 0; index < payload.length; index++) {
      const mealRequest = payload[index];
      const meal = await this.getById(mealRequest.meal_id);
      let mealTotalCost = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let mealTotalAddonCost = 0;
      mealTotalCost += meal.amount;
      for (
        let mealRequestIndex = 0;
        mealRequestIndex < mealRequest.addons.length;
        mealRequestIndex++
      ) {
        const addon = mealRequest.addons[mealRequestIndex];
        // for each, get pricing
        const meal = await this.getById(addon.meal_id);
        const addonCost = meal.amount;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        mealTotalAddonCost += addonCost;
        mealTotalCost += addonCost;
      }
      totalCost += mealTotalCost;
    }

    return totalCost;
  }
}
