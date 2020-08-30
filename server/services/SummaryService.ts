import { addDays, getDaysInMonth, getMonth, getYear, parse } from 'date-fns'
import { getConnection } from 'typeorm'

import CostType from '../enums/CostType'
import Cost from '../models/Cost'
import User from '../models/User'
import { BasicSummary, Profit, Spent } from '../types/BasicSummary'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import SummaryTotalByMonth from '../types/SummaryTotalByMonth'
import SummaryDayByDay from '../types/SummaryTotalDayByDay'

class SummaryService {
  public static async basicSummary(
    userId: User['id'],
    month?: number,
    year?: number
  ): Promise<BasicSummary> {
    if (!month) month = getMonth(new Date()) + 1
    if (!year) year = getYear(new Date())

    const list = await getConnection()
      .createQueryBuilder()
      .select('id')
      .addSelect('value')
      .addSelect('date')
      .addSelect('name')
      .addSelect('type')
      .addFrom(Cost, 'cost')
      .where('cost.user = :userId', { userId })
      .andWhere('EXTRACT(month from date) = :month', { month })
      .andWhere('EXTRACT(year from date) = :year', { year })
      .getRawMany()

    const sums = await getConnection()
      .createQueryBuilder()
      .select('SUM(value)')
      .addSelect('type')
      .from(Cost, 'cost')
      .where('cost.user = :userId', { userId })
      .andWhere('EXTRACT(month from date) = :month', { month })
      .andWhere('EXTRACT(year from date) = :year', { year })
      .groupBy('type')
      .getRawMany()

    const profits = list.filter((cost) => {
      return cost.type === CostType.PROFIT
    }) as Profit[]

    const spending = list.filter((cost) => {
      return cost.type === CostType.SPENT
    }) as Spent[]

    const sumProfits =
      sums.find((sum) => sum.type === CostType.PROFIT)?.sum ?? 0
    const sumSpending =
      sums.find((sum) => sum.type === CostType.SPENT)?.sum ?? 0

    return {
      spending: {
        sum: sumSpending,
        values: spending,
      },
      profits: {
        sum: sumProfits,
        values: profits,
      },
      total: Number(sumProfits) + Number(sumSpending),
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
      .addOrderBy('year')
      .addOrderBy('month')
      .getRawMany()
    return result
  }

  public static async summaryDayByDay(
    userId: User['id'],
    year?: number,
    month?: number
  ): Promise<SummaryDayByDay[]> {
    if (!month) month = getMonth(new Date()) + 1
    if (!year) year = getYear(new Date())

    const base = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date())

    const lastDay = getDaysInMonth(
      parse(`${year}-${month}`, 'yyyy-MM', new Date()).getUTCDate()
    )

    const connection = await getConnection()

    const values: SummaryDayByDay[] = []

    for (let day = 0; day < lastDay; day += 1) {
      const actualDay = addDays(base, day)
      const result = await connection
        .createQueryBuilder()
        .select('SUM(value) as total')
        .from(Cost, 'cost')
        .where('cost.user = :userId', { userId })
        .andWhere('date BETWEEN :start and :end', {
          start: base,
          end: actualDay,
        })
        .getRawOne()

      values.push({
        total: result.total ? result.total : 0,
        day: actualDay,
      })
    }

    return values
  }
}

export default SummaryService
