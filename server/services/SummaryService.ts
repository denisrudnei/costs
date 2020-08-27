import { getConnection } from 'typeorm'
import { getMonth, getYear } from 'date-fns'
import SummaryTotalByMonth from '../types/SummaryTotalByMonth'
import Cost from '../models/Cost'
import CostType from '../enums/CostType'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import User from '../models/User'
import { Spent, Profit, BasicSummary } from '../types/BasicSummary'
class SummaryService {
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

  public static async summaryByDate(
    id: User['id'],
    month?: number,
    year?: number
  ): Promise<SummaryGroupedByDate> {
    if (!month) month = getMonth(new Date()) + 1
    if (!year) year = getYear(new Date())

    const result = await getConnection()
      .createQueryBuilder()
      .select('SUM(value) as total')
      .addSelect('CAST(date as DATE) as date')
      .addSelect('type')
      .from(Cost, 'cost')
      .where('cost.user = :userId', { userId: id })
      .andWhere('EXTRACT(year from date) = :year', { year })
      .andWhere('EXTRACT(month from date) = :month', { month })
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

  public static async summaryTotalByMonth(
    userId: User['id']
  ): Promise<SummaryTotalByMonth[]> {
    const result = await getConnection()
      .createQueryBuilder()
      .select('EXTRACT(year from date) as year')
      .addSelect('EXTRACT(month from date) as month')
      .addSelect('SUM(value) as total')
      .addSelect('type')
      .from(Cost, 'cost')
      .where('cost.user = :userId', { userId })
      .groupBy('type')
      .addGroupBy('year')
      .addGroupBy('month')
      .getRawMany()
    return result
  }
}

export default SummaryService
