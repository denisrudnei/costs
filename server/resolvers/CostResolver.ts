import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import CostCreateInput from '../inputs/CostCreateInput'
import { BasicSummary } from '../types/BasicSummary'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import Cost from '~/models/Cost'
import CostService from '~/services/CostService'

@Resolver()
class CostResolver {
  @Query(() => [Cost])
  @Authorized('user')
  Costs(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return CostService.getAllCosts(id)
  }

  @Query(() => [Cost])
  @Authorized('user')
  GetProfits(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser

    return CostService.getProfits(id)
  }

  @Query(() => [Cost])
  @Authorized('user')
  GetSpending(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return CostService.getSpending(id)
  }

  @Query(() => [Cost])
  @Authorized('user')
  CostsByDate(@Arg('date') date: Date, @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return CostService.getCostsByDate(date, id)
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  RemoveCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Ctx() { req }: ExpressContext
  ) {
    const user = req.session!.authUser
    return CostService.remove(id, user.id)
  }

  @Query(() => BasicSummary)
  @Authorized('user')
  BasicSummary(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser

    return CostService.basicSummary(id)
  }

  @Query(() => SummaryGroupedByDate)
  @Authorized('user')
  SummaryGroupedByDate(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return CostService.summaryByDate(id)
  }

  @Mutation(() => Cost)
  @Authorized('user')
  CreateNewCost(
    @Arg('cost', () => CostCreateInput) cost: CostCreateInput,
    @Ctx() { req }: ExpressContext
  ) {
    const { id } = req.session!.authUser
    return CostService.createCost(new Cost(cost), id)
  }
}

export default CostResolver
