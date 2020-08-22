import { isSameDay } from 'date-fns'
import Cost from '~/models/Cost'
class CostService {
  public static getAllCosts(): Promise<Cost[]> {
    return Cost.find()
  }

  public static getProfits(): Promise<Cost[]> {
    return Cost.find()
  }

  public static async getCostsByDate(date: Date): Promise<Cost[]> {
    const costs = await Cost.find({})

    const sameDayCosts = costs.filter((cost) => {
      return isSameDay(cost.date, date)
    })

    return sameDayCosts
  }

  public static getSpending(): Cost[] {
    return [new Cost()]
  }

  public static createCost(cost: Cost): Promise<Cost> {
    return Cost.create(cost).save()
  }
}

export default CostService
