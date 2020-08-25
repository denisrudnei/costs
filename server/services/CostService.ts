import { isSameDay, format } from 'date-fns'

import _ from 'lodash'
import CostType from '../enums/CostType'
import User from '../models/User'
import { Profit, Spent, BasicSummary } from '../types/BasicSummary'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import Cost from '~/models/Cost'

class CostService {
  public static getAllCosts(userId: User['id']): Promise<Cost[]> {
    return Cost.find({
      where: {
        user: userId,
      },
    })
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

  public static async summaryByDate(): Promise<SummaryGroupedByDate> {
    const costs = await Cost.find()
    const spending = costs.filter((cost) => {
      return cost.type === CostType.SPENT
    })
    const profits = costs.filter((cost) => {
      return cost.type === CostType.PROFIT
    })

    return {
      profits: this.convertToTotalByDay(profits),
      spending: this.convertToTotalByDay(spending),
    }
  }

  private static convertToTotalByDay(costs: Cost[]) {
    const withDateConverted = costs.map((cost) => {
      const { date, ...rest } = cost
      return {
        ...rest,
        date: format(date, 'yyyy-MM-dd'),
      }
    })
    const grouped = _.groupBy(withDateConverted, 'date')

    const converted = Object.keys(grouped).map((name) => {
      const list = Object.values(grouped[name])

      const sum = list
        .map((value) => Number(value.value))
        .reduce((acc, value) => {
          return acc + value
        }, 0)

      return {
        date: name,
        total: sum,
      }
    })
    return converted
  }
}

export default CostService
