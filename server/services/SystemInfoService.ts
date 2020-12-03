import os from 'os';

export class SystemInfoService {
  public static getInfo() {
    return {
      arch: os.arch(),
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
    };
  }
}
