import {
  Resolver,
  Query,
  Arg,
  Mutation,
  ID,
  Authorized,
  Ctx,
} from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import CostCreateInput from '../inputs/CostCreateInput'
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
