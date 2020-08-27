import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { Ctx, Query, Resolver, Authorized } from 'type-graphql'

import DateService from '../services/DateService'
import UsedDates from '../types/UsedDates'

@Resolver()
class DateResolver {
  @Query(() => UsedDates)
  @Authorized('user')
  GetUsedDates(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser
    return DateService.getUsedDates(id)
  }
}

export default DateResolver
