import {
  Authorized, Ctx, Query, Resolver,
} from 'type-graphql';

import { Role } from '../enums/Role';
import DateService from '../services/DateService';
import { CustomExpressContext } from '../types/CustomSession';
import { UsedDates } from '../types/UsedDates';

@Resolver()
class DateResolver {
  @Query(() => UsedDates)
  @Authorized(Role.USER)
  public GetUsedDates(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return DateService.getUsedDates(id);
  }
}

export default DateResolver;
