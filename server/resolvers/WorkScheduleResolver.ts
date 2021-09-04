import { validate } from 'class-validator';
import {
  Arg, Authorized, Ctx, ID, Int, Mutation, Query, Resolver,
} from 'type-graphql';

import { WorkDayCreateInput } from '../inputs/WorkDayCreateInput';
import { Role } from '../enums/Role';
import { WorkDay } from '../models/WorkDay';
import { WorkSchedule } from '../models/WorkSchedule';
import { WorkScheduleService } from '../services/WorkScheduleService';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver()
export class WorkScheduleResolver {
  @Query(() => [WorkDay])
  @Authorized(Role.USER)
  public GetWorkDay(
    @Ctx() { req }: CustomExpressContext,
    @Arg('year', () => Int, { nullable: true }) year?: number,
    @Arg('month', () => Int, { nullable: true }) month?: number,
  ) {
    const { id } = req.session!.authUser!;
    return WorkScheduleService.getWorkDay(id, year, month);
  }

  @Query(() => WorkSchedule)
  @Authorized(Role.USER)
  public GetWorkSchedule(@Arg('year', () => Int) year: number, @Arg('month', () => Int) month: number, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return WorkScheduleService.getSchedule(year, month, id);
  }

  @Mutation(() => WorkDay)
  @Authorized(Role.USER)
  public async CreateWorkDay(@Arg('workDay', () => WorkDayCreateInput) workDay: WorkDay, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    const errors = await validate(new WorkDay(workDay));
    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints!));
      throw new Error(messages.toString());
    }

    return WorkScheduleService.createWorkDay(new WorkDay(workDay), id);
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveWorkDay(@Arg('id', () => ID) workDayId: WorkDay['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return WorkScheduleService.remove(workDayId, id);
  }
}
