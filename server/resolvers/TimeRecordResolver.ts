import {
  Arg, Authorized, Ctx, ID, Mutation, Query, Resolver,
} from 'type-graphql';

import { Role } from '../enums/Role';
import { Team } from '../models/Team';
import { TimeRecord } from '../models/TimeRecord';
import { TimeRecordService } from '../services/TimeRecordService';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver()
export class TimeRecordResolver {
  @Query(() => [TimeRecord])
  @Authorized(Role.USER)
  public GetTimeRecords(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.getForUser(id);
  }

  @Query(() => [TimeRecord])
  @Authorized(Role.USER)
  public GetTimeRecordsForTeam(@Arg('team', () => ID) teamId: Team['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.getForTeam(teamId, id);
  }

  @Mutation(() => TimeRecord)
  @Authorized(Role.USER)
  public RegisterTimeRecord(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.registerTimeRecord(id);
  }

  @Mutation(() => TimeRecord)
  @Authorized(Role.USER)
  public RegisterManualTimeRecord(@Arg('date', () => Date) date: Date, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.registerManualTimeRecord(date, id);
  }
}
