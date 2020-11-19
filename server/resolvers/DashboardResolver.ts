import { Authorized, Query, Resolver } from 'type-graphql';

import DashboardService from '../services/DashboardService';
import { Dashboard } from '../types/Dashboard';

@Resolver(() => Dashboard)
class DashboardResolver {
  @Query(() => Dashboard)
  @Authorized('ADMIN')
  public Dashboard() {
    return DashboardService.getDashboard();
  }
}

export default DashboardResolver;
