import { isSameDay } from 'date-fns'
import { getConnection } from 'typeorm'

import CostType from '../enums/CostType'
import User from '../models/User'
import { BasicSummary, Profit, Spent } from '../types/BasicSummary'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import CostEditInput from '../inputs/CostEditInput'
import Cost from '~/models/Cost'

class CostService {
  public static getAllCosts(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
      },
    })
  }

  public static async getOne(
    id: Cost['id'],
    userId: User['id']
  ): Promise<Cost> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    })
    if (!cost) throw new Error('Cost not found')
    return cost
  }

  public static async edit(
    id: Cost['id'],
    userId: User['id'],
    costToEdit: CostEditInput
  ): Promise<Cost> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    })
    if (!cost) throw new Error('COst not found')
    Object.assign(cost, costToEdit)
    return cost.save()
  }

  public static getProfits(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
        type: CostType.PROFIT,
      },
    })
  }

  public static async getCostsByDate(
    date: Date,
    userId: User['id']
  ): Promise<Cost[]> {
    const costs = await Cost.find({
      where: {
        user: userId,
      },
    })

    const sameDayCosts = costs.filter((cost) => {
      return isSameDay(cost.date, date)
    })

    return sameDayCosts
  }

  public static getSpending(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
        type: CostType.SPENT,
      },
    })
  }

  public static async createCost(
    cost: Cost,
    userId: User['id']
  ): Promise<Cost> {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const newCost = Cost.create()
    Object.assign(newCost, cost)
    newCost.user = user
    return newCost.save()
  }

  public static async basicSummary(userId: User['id']): Promise<BasicSummary> {
    const profits = (await Cost.find({
      where: {
        user: userId,
        type: CostType.PROFIT,
      },
    })) as Profit[]

    const spending = (await Cost.find({
      where: {
        user: userId,
        type: CostType.SPENT,
      },
    })) as Spent[]

    const sumProfits = profits.reduce((acc, profit) => {
      return acc + profit.value
    }, 0)
    const sumSpending = spending.reduce((acc, spent) => {
      return acc + spent.value
    }, 0)

    return {
      spending: {
        sum: sumSpending,
        values: spending,
      },
      profits: {
        sum: sumProfits,
        values: profits,
      },
      total: sumProfits - sumSpending,
    }
  }

  public static async remove(
    id: Cost['id'],
    userId: User['id']
  ): Promise<boolean> {
    const cost = await Cost.findOne({
      where: {
        id,
        user: userId,
      },
    })
    if (!cost) throw new Error('Cost not found')
    await Cost.remove(cost)
    return true
  }

  public static async summaryByDate(
    id: User['id']
  ): Promise<SummaryGroupedByDate> {
    const result = await getConnection()
      .createQueryBuilder()
      .select('SUM(value) as total')
      .addSelect('CAST(date as DATE) as date')
      .addSelect('type')
      .from(Cost, 'cost')
      .where('cost.user = :userId', { userId: id })
      .groupBy('type')
      .addGroupBy('CAST(date as Date)')
      .getRawMany()

    const spending = result.filter((cost) => {
      return cost.type === CostType.SPENT
    })

    const profits = result.filter((cost) => {
      return cost.type === CostType.PROFIT
    })

    return {
      profits,
      spending,
    }
  }
}

export default CostService
