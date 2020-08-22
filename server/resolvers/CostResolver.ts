import { Resolver, Query, Arg, Mutation } from 'type-graphql'
import CostCreateInput from '../inputs/CostCreateInput'
import Cost from '~/models/Cost'
import CostService from '~/services/CostService'

@Resolver()
class CostResolver {
  @Query(() => [Cost])
  Costs() {
    return CostService.getAllCosts()
  }

  @Query(() => [Cost])
  CostsByDate(@Arg('date') date: Date) {
    return CostService.getCostsByDate(date)
  }

  @Mutation(() => Cost)
  CreateNewCost(@Arg('cost', () => CostCreateInput) cost: CostCreateInput) {
    return CostService.createCost(new Cost(cost))
  }
}

export default CostResolver
