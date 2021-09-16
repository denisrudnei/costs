import {
  addHours, addMinutes, differenceInHours, getMonth, getYear, lastDayOfMonth, parse,
} from 'date-fns';
import { getConnection } from 'typeorm';

import { User } from '../models/User';
import { WorkDay } from '../models/WorkDay';

export class WorkScheduleService {
  public static async createWorkDay(workDay: WorkDay, userId: User['id']) {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error('User not found');
    workDay.user = user;
    return WorkDay.save(workDay);
  }

  public static async getWorkDay(userId: User['id'], year?: number, month?: number) {
    const today = new Date();
    const defaultMonth = getMonth(today) + 1;
    const defaultYear = getYear(today);
    const startDay = parse(`${year || defaultYear}-${month || defaultMonth}-01`, 'yyyy-MM-dd', new Date());

    const lastDay = lastDayOfMonth(startDay);
    const connection = await getConnection();
    const result = await connection.createQueryBuilder()
      .select('*')
      .from(WorkDay, 'work_day')
      .where('work_day.user = :userId', {
        userId,
      })
      .andWhere('day BETWEEN :start AND :finish', {
        start: startDay,
        finish: lastDay,
      })
      .getRawMany();
    return result;
  }

  public static async getSchedule(year: number, month: number, userId: User['id']) {
    const startDay = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());
    const lastDay = lastDayOfMonth(startDay);

    let workedHours = 0;

    const connection = await getConnection();

    const result: WorkDay[] = await connection.createQueryBuilder()
      .select('*')
      .from(WorkDay, 'work_day')
      .where('work_day.user = :userId', {
        userId,
      })
      .andWhere('day BETWEEN :start AND :finish', {
        start: startDay,
        finish: lastDay,
      })
      .getRawMany();

    workedHours = result
      .map((work) => {
        const date = new Date(0).toISOString();
        const base = parse(`${date.substr(0, 10)} ${date.substr(11, 8)}`, 'yyyy-MM-dd HH:mm:ss', new Date());
        const [startHour, startMinutes] = work.start.split(':').map((value) => parseInt(value, 10));
        const [finishHour, finishMinutes] = work.finish.split(':').map((value) => parseInt(value, 10));
        const start = addMinutes(addHours(base, startHour), startMinutes);
        const finish = addMinutes(addHours(base, finishHour), finishMinutes);
        return {
          start,
          finish,
        };
      })
      .reduce(
        (acc, work) => acc + Math.abs(differenceInHours(work.start, work.finish)),
        0,
      );

    const workedDays = await getConnection()
      .createQueryBuilder()
      .select('EXTRACT(day from day) as singleDay')
      .from(WorkDay, 'work_day')
      .where('day BETWEEN :start AND :finish', {
        start: startDay,
        finish: lastDay,
      })
      .andWhere('work_day.user = :userId', {
        userId,
      })
      .groupBy('singleDay')
      .getRawMany();

    return {
      workDays: result,
      workedDays: workedDays.length,
      workedHours,
    };
  }

  public static async getPeriod(start: Date, finish: Date, userId: User['id']) {
    const result = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from(WorkDay, 'work_day')
      .where('day BETWEEN :start AND :finish', {
        start,
        finish,
      })
      .andWhere('work_day.user = :userId', {
        userId,
      })
      .getRawMany();
    return result;
  }

  public static async remove(id: WorkDay['id'], userId: User['id']) {
    const workDay = await WorkDay.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!workDay) throw new Error('Work day not found');
    await WorkDay.remove(workDay);
    return true;
  }
}
