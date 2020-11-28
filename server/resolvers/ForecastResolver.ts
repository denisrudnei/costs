import {
  Authorized, Query, Resolver, Mutation, Arg, Ctx, ID,
} from 'type-graphql';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Forecast } from '../models/Forecast';
import { ForecastService } from '../services/ForecastsService';
import { ForecastInput } from '../inputs/ForecastInput';
import { ForecastInMonths } from '../types/ForecastInMonths';
import { TotalForecastInMonths } from '../types/TotalForecastInMonths';

@Resolver(() => Forecast)
export class ForecastResolver {
  @Query(() => [Forecast])
  @Authorized('user')
  public GetForecast(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return ForecastService.getAll(id);
  }

  @Mutation(() => Forecast)
  @Authorized('user')
  public CreateForecast(@Arg('forecast', () => ForecastInput) forecast: Forecast, @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return ForecastService.create(forecast, id);
  }

  @Query(() => [ForecastInMonths])
  @Authorized('user')
  public ForecastsInMonths(@Arg('ids', () => [ID]) ids: Forecast['id'][], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.forecastInMonths(ids, id);
  }

  @Query(() => [TotalForecastInMonths])
  @Authorized('user')
  public TotalForecastInMonths(@Arg('ids', () => [ID]) ids: Forecast['id'][], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.totalForecastInMonths(ids, id);
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  public RemoveForecast(@Arg('id', () => ID) forecastId: Forecast['id'], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser!;
    return ForecastService.remove(forecastId, id);
  }
}