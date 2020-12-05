import {
  Arg, Authorized, Ctx, ID, Int, Mutation, Query, Resolver,
} from 'type-graphql';

import { ForecastEditInput } from '../inputs/ForecastEditInput';
import { ForecastInput } from '../inputs/ForecastInput';
import { Forecast } from '../models/Forecast';
import { ForecastService } from '../services/ForecastsService';
import { CustomExpressContext } from '../types/CustomSession';
import { ForecastInMonths } from '../types/ForecastInMonths';
import { TotalForecastInMonths } from '../types/TotalForecastInMonths';

@Resolver(() => Forecast)
export class ForecastResolver {
  @Query(() => [Forecast])
  @Authorized('user')
  public GetForecast(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.getAll(id);
  }

  @Query(() => Forecast)
  @Authorized('user')
  public GetOneForecast(@Arg('id', () => ID) forecastId: Forecast['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.getOne(forecastId, id);
  }

  @Mutation(() => Forecast)
  @Authorized('user')
  public CreateForecast(@Arg('forecast', () => ForecastInput) forecast: Forecast, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.create(forecast, id);
  }

  @Mutation(() => Forecast)
  @Authorized('user')
  public EditForecast(@Arg('id', () => ID) forecastId: Forecast['id'], @Arg('forecast', () => ForecastEditInput) forecast: Forecast, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.edit(forecastId, forecast, id);
  }

  @Query(() => [ForecastInMonths])
  @Authorized('user')
  public ForecastsInMonths(@Arg('ids', () => [ID]) ids: Forecast['id'][], @Arg('months', () => Int, { nullable: true }) months: number, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.forecastInMonths(ids, id, months);
  }

  @Query(() => [TotalForecastInMonths])
  @Authorized('user')
  public TotalForecastInMonths(
    @Arg('ids', () => [ID]) ids: Forecast['id'][],
    @Arg('start', () => Date) start: Date,
    @Arg('end', () => Date) end: Date,
    @Ctx() { req }: CustomExpressContext,
  ) {
    const { id } = req.session!.authUser!;
    return ForecastService.totalForecastInMonths(ids, id, start, end);
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  public RemoveForecast(@Arg('id', () => ID) forecastId: Forecast['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.remove(forecastId, id);
  }
}
