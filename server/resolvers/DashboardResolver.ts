import { Authorized, Query, Resolver } from 'type-graphql';

import DashboardService from '../services/DashboardService';
import { Dashboard } from '../types/Dashboard';
import { Role } from '../enums/Role';

@Resolver(() => Dashboard)
class DashboardResolver {
  @Query(() => Dashboard)
  @Authorized(Role.ADMIN)
  public Dashboard() {
    return DashboardService.getDashboard();
  }
}

export default DashboardResolver;
