import { isSameDay } from 'date-fns'
import CostType from '../enums/CostType'
import Cost from '~/models/Cost'

class CostService {
  public static getAllCosts(): Promise<Cost[]> {
    return Cost.find()
  }

  public static getProfits(): Promise<Cost[]> {
    return Cost.find({
      where: {
        type: CostType.PROFIT,
      },
    })
  }

  public static async getCostsByDate(date: Date): Promise<Cost[]> {
    const costs = await Cost.find({})

    const sameDayCosts = costs.filter((cost) => {
      return isSameDay(cost.date, date)
    })

    return sameDayCosts
  }

  public static getSpending(): Promise<Cost[]> {
    return Cost.find({
      where: {
        type: CostType.SPENT,
      },
    })
  }

  public static createCost(cost: Cost): Promise<Cost> {
    return Cost.create(cost).save()
  }

  public static async remove(id: Cost['id']): Promise<boolean> {
    const cost = await Cost.findOne(id)
    if (!cost) throw new Error('Cost not found')
    await Cost.remove(cost)
    return true
  }
}

export default CostService
