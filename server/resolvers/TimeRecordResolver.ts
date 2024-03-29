import {
  Arg, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root,
} from 'type-graphql';

import { Role } from '../enums/Role';
import { Team } from '../models/Team';
import { TimeRecord } from '../models/TimeRecord';
import { TimeRecordService } from '../services/TimeRecordService';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver(() => TimeRecord)
export class TimeRecordResolver {
  @Query(() => [TimeRecord])
  @Authorized(Role.USER)
  public GetTimeRecords(@Arg('date', () => Date, { nullable: true, defaultValue: new Date() }) date: Date, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.getForUser(id, date);
  }

  @Query(() => [TimeRecord])
  @Authorized(Role.USER)
  public GetTimeRecordsForTeam(@Arg('team', () => ID) teamId: Team['id'], @Arg('date', () => Date, { nullable: true, defaultValue: new Date() }) date: Date, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.getForTeam(teamId, id, date);
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

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveTimeRecord(@Arg('time', () => ID) time: TimeRecord['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return TimeRecordService.remove(time, id);
  }

  @FieldResolver()
  public async user(@Root() root: TimeRecord) {
    const { user } = await TimeRecord.findOne(root.id, { relations: ['user'] }) as TimeRecord;
    return user;
  }
}
