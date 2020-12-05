import {
  Query, Resolver, Authorized, Ctx, Int, Arg,
} from 'type-graphql';

import { CustomExpressContext } from '../types/CustomSession';
import SummaryService from '../services/SummaryService';
import { SummaryTotalByMonth } from '../types/SummaryTotalByMonth';
import { SummaryGroupedByDate } from '../types/SummaryGroupedByDate';
import { BasicSummary } from '../types/BasicSummary';
import { SummaryDayByDay } from '../types/SummaryTotalDayByDay';

@Resolver()
class SummaryResolver {
  @Query(() => BasicSummary)
  @Authorized('user')
  BasicSummary(
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
  @Authorized('user')
  SummaryGroupedByDate(
    @Ctx() { req }: CustomExpressContext,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
  ) {
    const { id } = req.session!.authUser!;
    return SummaryService.summaryByDate(id, month, year);
  }

  @Query(() => [SummaryTotalByMonth])
  @Authorized('user')
  SummaryTotalByMonth(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return SummaryService.summaryTotalByMonth(id);
  }

  @Query(() => [SummaryDayByDay])
  @Authorized('user')
  SummaryDayByDay(
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
