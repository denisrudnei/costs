import {
  Arg, Authorized, Ctx, Int, Query, Resolver,
} from 'type-graphql';

import { Role } from '../enums/Role';
import SummaryService from '../services/SummaryService';
import { BasicSummary } from '../types/BasicSummary';
import { CustomExpressContext } from '../types/CustomSession';
import { SummaryGroupedByDate } from '../types/SummaryGroupedByDate';
import { SummaryTotalByMonth } from '../types/SummaryTotalByMonth';
import { SummaryDayByDay } from '../types/SummaryTotalDayByDay';

@Resolver()
class SummaryResolver {
  @Query(() => BasicSummary)
  @Authorized(Role.USER)
  public BasicSummary(
    @Ctx() { req }: CustomExpressContext,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('useLastMonthBalance', () => Boolean, { nullable: true })
      useLastMonthBalance?: boolean,
  ) {
    const { id } = req.session!.authUser!;

    return SummaryService.basicSummary(id, month, year, useLastMonthBalance);
  }

  @Query(() => SummaryGroupedByDate)
  @Authorized(Role.USER)
  public SummaryGroupedByDate(
    @Ctx() { req }: CustomExpressContext,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
  ) {
    const { id } = req.session!.authUser!;
    return SummaryService.summaryByDate(id, month, year);
  }

  @Query(() => [SummaryTotalByMonth])
  @Authorized(Role.USER)
  public SummaryTotalByMonth(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return SummaryService.summaryTotalByMonth(id);
  }

  @Query(() => [SummaryDayByDay])
  @Authorized(Role.USER)
  public SummaryDayByDay(
    @Ctx() { req }: CustomExpressContext,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('allDays', () => Boolean, { nullable: true }) allDays?: boolean,
  ) {
    const { id } = req.session!.authUser!;
    return SummaryService.summaryDayByDay(id, year, month, allDays);
  }
}

export default SummaryResolver;
