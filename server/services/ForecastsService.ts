/* eslint-disable no-loop-func */
import {
  addMonths, differenceInMonths, isAfter, isBefore, isWithinInterval,
} from 'date-fns';

import { In } from 'typeorm';
import CostType from '../enums/CostType';
import { Forecast } from '../models/Forecast';
import { User } from '../models/User';
import { ForecastValue } from '../types/ForecastValue';
import { TotalForecastInMonths } from '../types/TotalForecastInMonths';

export class ForecastService {
  public static async getAll(userId: User['id']) {
    return Forecast.find({
      where: {
        user: userId,
      },
    });
  }

  public static async create(forecast: Forecast, userId: User['id']) {
    const user = await User.findOne(userId);
    if (!user) throw new Error('User not found');
    forecast.user = user;
    if (forecast.value < 0) forecast.type = CostType.SPENT;
    if (forecast.type === CostType.SPENT) forecast.value = -Math.abs(forecast.value);
    return Forecast.save(forecast);
  }

  public static async forecastInMonths(ids: Forecast['id'][], userId: User['id'], numberOfMonths: number = 12) {
    const forecasts = await Forecast.find({
      where: {
        id: In(ids),
        user: userId,
      },
    });
    const result = forecasts.map((forecast) => {
      const end = forecast.indeterminate ? addMonths(forecast.start, numberOfMonths) : forecast.end;
      const months = Math.abs(differenceInMonths(forecast.start, end));
      const total = months * forecast.value;
      let actualDate = forecast.start;
      const values: ForecastValue[] = [];
      while (isBefore(actualDate, end)) {
        const value = values.length >= 1
          ? Number(values[values.length - 1].value)
          + Number(forecast.value)
          : forecast.value;
        values.push({
          name: forecast.name,
          date: actualDate,
          value,
        });
        actualDate = addMonths(actualDate, 1);
      }
      return {
        ...forecast,
        months,
        total,
        values,
      };
    });
    return result;
  }

  public static async totalForecastInMonths(ids: Forecast['id'][], userId: User['id'], startDate: Date, endDate: Date) {
    const result: TotalForecastInMonths[] = [];

    const forecasts = await Forecast.find({
      where: {
        id: In(ids),
        user: userId,
      },
    });

    let actualDate = startDate;

    while (isBefore(actualDate, endDate)) {
      const toSum = forecasts
        .filter((forecast) => {
          if (!forecast.indeterminate) {
            return isWithinInterval(actualDate, { start: forecast.start, end: forecast.end });
          }
          return isBefore(forecast.start, actualDate);
        });
      this.addToResult(result, toSum, actualDate);
      actualDate = addMonths(actualDate, 1);
    }
    return result;
  }

  private static async addToResult(
    result: TotalForecastInMonths[],
    toSum: Forecast[],
    actualDate: Date,
  ) {
    const value = {
      names: toSum.map((item) => item.name),
      date: actualDate,
      total: toSum
        .map((f) => f.value)
        .reduce((acc, value) => Number(acc) + Number(value), 0),
    };
    if (result.length === 0) { result.push(value); }
    if (result[result.length - 1].total !== value.total) result.push(value);
  }

  public static async remove(id: Forecast['id'], userId: User['id']) {
    const forecast = await Forecast.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!forecast) throw new Error('Forecast not found');
    await Forecast.remove(forecast);
    return true;
  }
}
