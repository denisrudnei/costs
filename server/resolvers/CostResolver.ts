import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { CustomExpressContext } from '../types/CustomSession';
import { CostCreateInput } from '../inputs/CostCreateInput';
import { CostEditInput } from '../inputs/CostEditInput';
import { Cost } from '~/models/Cost';
import CostService from '~/services/CostService';

@Resolver()
class CostResolver {
  @Query(() => [Cost])
  @Authorized('user')
  Costs(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getAllCosts(id);
  }

  @Query(() => Cost)
  @Authorized('user')
  GetOneCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const userId = req.session!.authUser!.id;
    return CostService.getOne(id, userId);
  }

  @Mutation(() => Cost)
  @Authorized('user')
  EditCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Arg('cost') cost: CostEditInput,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const userId = req.session!.authUser!.id;
    return CostService.edit(id, userId, cost);
  }

  @Query(() => [Cost])
  @Authorized('user')
  GetProfits(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;

    return CostService.getProfits(id);
  }

  @Query(() => [Cost])
  @Authorized('user')
  GetSpending(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getSpending(id);
  }

  @Query(() => [Cost])
  @Authorized('user')
  CostsByDate(@Arg('date') date: Date, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getCostsByDate(date, id);
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  RemoveCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const user = req.session!.authUser!;
    return CostService.remove(id, user.id);
  }

  @Mutation(() => Cost)
  @Authorized('user')
  CreateNewCost(
    @Arg('cost', () => CostCreateInput) cost: CostCreateInput,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const { id } = req.session!.authUser!;
    return CostService.createCost(new Cost(cost), id);
  }
}

export default CostResolver;
