import {
  Ctx, Query, Resolver, Authorized,
} from 'type-graphql';
import { CustomExpressContext } from '../types/CustomSession';

import DateService from '../services/DateService';
import { UsedDates } from '../types/UsedDates';

@Resolver()
class DateResolver {
  @Query(() => UsedDates)
  @Authorized('user')
  GetUsedDates(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return DateService.getUsedDates(id);
  }
}

export default DateResolver;
