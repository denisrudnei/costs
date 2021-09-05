import {
  Arg, Authorized, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root,
} from 'type-graphql';
import { Cost } from '~/models/Cost';
import CostService from '~/services/CostService';

import { CostCreateInput } from '../inputs/CostCreateInput';
import { CostEditInput } from '../inputs/CostEditInput';
import { Role } from '../enums/Role';
import {
  CostPagination, OrderType, PaginationOptions, SortType,
} from '../types/CostPagination';
import { CustomExpressContext } from '../types/CustomSession';
import { BankAccount } from '../models/BankAccount';

@Resolver(() => Cost)
class CostResolver {
  @Query(() => [Cost])
  @Authorized(Role.USER)
  public Costs(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getAllCosts(id);
  }

  @Query(() => CostPagination)
  @Authorized(Role.USER)
  public CostPagination(
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
  @Authorized(Role.USER)
  public GetOneCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const userId = req.session!.authUser!.id;
    return CostService.getOne(id, userId);
  }

  @Mutation(() => Cost)
  @Authorized(Role.USER)
  public EditCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Arg('cost') cost: CostEditInput,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const userId = req.session!.authUser!.id;
    return CostService.edit(id, userId, cost);
  }

  @Query(() => [Cost])
  @Authorized(Role.USER)
  public GetProfits(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;

    return CostService.getProfits(id);
  }

  @Query(() => [Cost])
  @Authorized(Role.USER)
  public GetSpending(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getSpending(id);
  }

  @Query(() => [Cost])
  @Authorized(Role.USER)
  public CostsByDate(@Arg('date') date: Date, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return CostService.getCostsByDate(date, id);
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveCost(
    @Arg('id', () => ID) id: Cost['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const user = req.session!.authUser!;
    return CostService.remove(id, user.id);
  }

  @Mutation(() => Cost)
  @Authorized(Role.USER)
  public CreateNewCost(
    @Arg('cost', () => CostCreateInput) cost: CostCreateInput,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const { id } = req.session!.authUser!;
    return CostService.createCost(new Cost(cost), id);
  }

  @FieldResolver()
  public async bankAccount(@Root() root: Cost): Promise<BankAccount | undefined> {
    const { bankAccount } = await Cost.findOne(root.id, { relations: ['bankAccount'] }) as Cost;
    return bankAccount;
  }
}

export default CostResolver;
