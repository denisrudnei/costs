import {
  Arg, Authorized, Ctx, ID, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import { Cost } from '~/models/Cost';
import CostService from '~/services/CostService';

import { CostCreateInput } from '../inputs/CostCreateInput';
import { CostEditInput } from '../inputs/CostEditInput';
import {
  CostPagination, SortType, OrderType, PaginationOptions,
} from '../types/CostPagination';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver()
class CostResolver {
  @Query(() => [Cost])
  @Authorized('user')
  Costs(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getAllCosts(id);
  }

  @Query(() => CostPagination)
  @Authorized('user')
  CostPagination(
    @Arg('search', () => String, { defaultValue: '', nullable: true }) search: PaginationOptions['search'],
    @Arg('page', () => Int, { defaultValue: 1, nullable: true }) page: PaginationOptions['page'],
    @Arg('limit', () => Int, { defaultValue: 10, nullable: true }) limit: PaginationOptions['limit'],
    @Arg('type', () => SortType, { defaultValue: 'type', nullable: true }) type: PaginationOptions['type'],
    @Arg('order', () => OrderType, { defaultValue: 'DESC', nullable: true }) order: PaginationOptions['order'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const { id } = req.session!.authUser!;
    return CostService.getPagination({
      search, page, limit, type, order,
    }, id);
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
