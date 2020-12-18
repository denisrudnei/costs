import { format } from 'date-fns';

import { Type } from '../enums/ExportFile/Type';
import { Separators } from '../enums/ImportFile/Separators';
import { Cost } from '../models/Cost';
import { Forecast } from '../models/Forecast';
import { Loan } from '../models/Loan';
import { User } from '../models/User';
import { WorkDay } from '../models/WorkDay';
import CostService from './CostService';
import { ForecastService } from './ForecastsService';
import { LoanService } from './LoanService';
import { WorkScheduleService } from './WorkScheduleService';

export class ExportService {
  public static async exportInfo(start: Date, finish: Date, type: Type, separator: Separators, userId: User['id']) {
    let data: unknown[] = [];
    switch (type) {
      case Type.COST: {
        data = await CostService.getPeriod(start, finish, userId);
        break;
      }
      case Type.LOAN: {
        data = await LoanService.getPeriod(start, finish, userId);
        break;
      }
      case Type.FORECAST: {
        data = await ForecastService.getPeriod(start, finish, userId);
        break;
      }
      case Type.WORK_DAY: {
        data = await WorkScheduleService.getPeriod(start, finish, userId);
        break;
      }
      default: {
        throw new Error('Unknown type');
      }
    }

    return this.export(data, separator, type);
  }

  public static export(data: unknown[], separator: Separators, type: Type) {
    let content = '';

    for (let i = 0; i < data.length; i += 1) {
      const object = data[i];
      content += `${this.mapCost(object, separator, type)}\n`;
    }

    return content;
  }

  public static mapCost(item: unknown, sep: Separators, type: Type) {
    const fmt = (date: Date) => format(date, 'dd/MM/yyyy');

    switch (type) {
      case Type.COST: {
        const cost = item as Cost;
        return `${fmt(cost.date)}${sep}${cost.name}${sep}${cost.value}`;
      }
      case Type.FORECAST: {
        const forecast = item as Forecast;
        return `${fmt(forecast.start)}${sep}${fmt(forecast.end)}${sep}${forecast.name}${forecast.value}`;
      }
      case Type.LOAN: {
        const loan = item as Loan;
        return `${loan.name}${sep}${loan.portions}${sep}${loan.total}`;
      }
      case Type.WORK_DAY: {
        const workDay = item as WorkDay;
        return `${fmt(workDay.day)}${sep}${workDay.start}${sep}${workDay.finish}`;
      }
      default: {
        throw new Error('Unknown type');
      }
    }
  }
}
