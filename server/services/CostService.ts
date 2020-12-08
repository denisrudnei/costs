import { isSameDay } from 'date-fns';

import { In, Raw } from 'typeorm';
import CostType from '../enums/CostType';
import { CostEditInput } from '../inputs/CostEditInput';
import { User } from '../models/User';
import { Cost } from '~/models/Cost';
import { CostPagination } from '../types/CostPagination';

export type PaginationOptions = {
  search: string
  page: number
  limit: CostPagination['limit']
  type: 'name' | 'type' | 'value'
  order: 'ASC' | 'DESC'
}

class CostService {
  public static getAllCosts(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
      },
    });
  }

  public static async getPagination(options: PaginationOptions, userId: User['id']) {
    const {
      search, limit, page, type, order,
    } = options;
    const total = await Cost.count({
      where: {
        name: Raw((alias) => `${alias} ILIKE '%${search}%'`),
        user: userId,
      },
    });
    const pages = Math.round(total / limit);
    const costs = await Cost.find({
      where: {
        name: Raw((alias) => `${alias} ILIKE '%${search}%'`),
        user: userId,
      },
      order: {
        [type]: order,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return new CostPagination({
      page,
      pages,
      limit,
      costs,
      total,
    });
  }

  public static async getOne(
    id: Cost['id'],
    userId: User['id'],
  ): Promise<Cost> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!cost) throw new Error('Cost not found');
    return cost;
  }

  public static async edit(
    id: Cost['id'],
    userId: User['id'],
    costToEdit: CostEditInput,
  ): Promise<Cost> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!cost) throw new Error('COst not found');
    Object.assign(cost, costToEdit);
    return cost.save();
  }

  public static getProfits(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
        type: CostType.PROFIT,
      },
    });
  }

  public static async getCostsByDate(
    date: Date,
    userId: User['id'],
  ): Promise<Cost[]> {
    const costs = await Cost.find({
      where: {
        user: userId,
      },
    });

    const sameDayCosts = costs.filter((cost) => isSameDay(cost.date, date));

    return sameDayCosts;
  }

  public static getSpending(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
        type: CostType.SPENT,
      },
    });
  }

  public static async createCost(
    cost: Cost,
    userId: User['id'],
  ): Promise<Cost> {
    const user = await User.findOne(userId);
    if (!user) throw new Error('User not found');
    const newCost = Cost.create();
    Object.assign(newCost, cost);
    newCost.user = user;
    return newCost.save();
  }

  public static async remove(
    id: Cost['id'],
    userId: User['id'],
  ): Promise<boolean> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!cost) throw new Error('Cost not found');
    await Cost.remove(cost);
    return true;
  }

  public static async getNotDuplicates(costs: Cost[]) {
    const names = costs.map((cost) => cost.name);
    const dates = costs.map((cost) => cost.date);
    const values = costs.map((cost) => cost.value);
    const costsInDb = await Cost.find({
      where: {
        name: In(names),
        date: In(dates),
        value: In(values),
      },
    });

    return costs.filter((cost) => {
      const inDb = costsInDb.find((toFind) => cost.name === toFind.name
      && Number(cost.value) === Number(toFind.value)
      && isSameDay(cost.date, toFind.date));
      return !inDb;
    });
  }
}

export default CostService;
