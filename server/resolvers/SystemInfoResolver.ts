import {
  Authorized,
  PubSub,
  PubSubEngine,
  Query, Resolver, Root, Subscription,
} from 'type-graphql';

import Bull from 'bull';
import { SystemInfo } from '../types/systemInfo/SystemInfo';
import { SystemInfoService } from '../services/SystemInfoService';

@Resolver(() => SystemInfo)
export class SystemInfoResolver {
  public static queue = new Bull<null>('getSystemInfo', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

  @Query(() => SystemInfo)
  @Authorized('admin')
  public GetSystemInfo() {
    return SystemInfoService.getInfo();
  }

  @Query(() => SystemInfo)
  @Authorized('admin')
  public async StartGetInfo(@PubSub() pubSub: PubSubEngine) {
    const workers = await SystemInfoResolver.queue.getWorkers();
    if (workers.length === 0) {
      SystemInfoResolver.queue.process(async () => {
        const info = await SystemInfoService.getInfo();
        pubSub.publish('GET_EVERY_SYSTEM_INFO', info);
      });

      await SystemInfoResolver.queue.add(null, {
        delay: 1_000,
        repeat: {
          every: 1_000,
        },
      });
    }

    return SystemInfoService.getInfo();
  }

  @Subscription(() => SystemInfo, {
    topics: 'GET_EVERY_SYSTEM_INFO',
  })
  public GetEverySecond(@Root() root: SystemInfo) {
    return root;
  }
}
