import os from 'os';
import { PubSubEngine } from 'type-graphql';
import Bull from 'bull';
import { SystemInfoEvents } from '../enums/SystemInfoEvents';

export class SystemInfoService {
  public static queue = new Bull<null>('getSystemInfo', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

  public static async start(pubSub: PubSubEngine) {
    this.queue.process(async () => {
      const info = await SystemInfoService.getInfo();
      pubSub.publish(SystemInfoEvents.GET_EVERY_SYSTEM_INFO, info);
    });

    await this.queue.add(null, {
      delay: 1_000,
      repeat: {
        every: 1_000,
      },
    });
  }

  public static getInfo() {
    return {
      arch: os.arch(),
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
    };
  }
}
