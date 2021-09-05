import {
  Authorized, Query, Resolver, Root, Subscription,
} from 'type-graphql';

import { Role } from '../enums/Role';
import { SystemInfoEvents } from '../enums/SystemInfoEvents';
import { SystemInfoService } from '../services/SystemInfoService';
import { SystemInfo } from '../types/systemInfo/SystemInfo';

@Resolver(() => SystemInfo)
export class SystemInfoResolver {
  @Query(() => SystemInfo)
  @Authorized(Role.ADMIN)
  public GetSystemInfo() {
    return SystemInfoService.getInfo();
  }

  @Subscription(() => SystemInfo, {
    topics: SystemInfoEvents.GET_EVERY_SYSTEM_INFO,
  })
  public GetEverySecond(@Root() root: SystemInfo) {
    return root;
  }
}
