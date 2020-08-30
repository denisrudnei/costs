import { Query, Resolver, Authorized, Ctx, Int, Arg } from 'type-graphql'

import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import SummaryService from '../services/SummaryService'
import SummaryTotalByMonth from '../types/SummaryTotalByMonth'
import SummaryGroupedByDate from '../types/SummaryGroupedByDate'
import { BasicSummary } from '../types/BasicSummary'
import SummaryDayByDay from '../types/SummaryTotalDayByDay'

@Resolver()
class SummaryResolver {
  @Query(() => BasicSummary)
  @Authorized('user')
  BasicSummary(
    @Ctx() { req }: ExpressContext,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('useLastMonthBalance', () => Boolean, { nullable: true })
    useLastMonthBalance?: boolean
  ) {
    const { id } = req.session!.authUser

    return SummaryService.basicSummary(id, month, year, useLastMonthBalance)
  }

  @Query(() => SummaryGroupedByDate)
  @Authorized('user')
  SummaryGroupedByDate(
    @Ctx() { req }: ExpressContext,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number
  ) {
    const { id } = req.session!.authUser
    return SummaryService.summaryByDate(id, month, year)
  }

  @Query(() => [SummaryTotalByMonth])
  @Authorized('user')
  SummaryTotalByMonth(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return SummaryService.summaryTotalByMonth(id)
  }

  @Query(() => [SummaryDayByDay])
  @Authorized('user')
  SummaryDayByDay(
    @Ctx() { req }: ExpressContext,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('month', () => Int, { nullable: true }) month?: number
  ) {
    const { id } = req.session!.authUser
    return SummaryService.summaryDayByDay(id, year, month)
  }
}

export default SummaryResolver
