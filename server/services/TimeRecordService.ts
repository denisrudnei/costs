import { getDate, lastDayOfMonth, set } from 'date-fns';
import { Between, getConnection } from 'typeorm';

import { Team } from '../models/Team';
import { TimeRecord } from '../models/TimeRecord';
import { User } from '../models/User';

export class TimeRecordService {
  public static getAll() {
    return TimeRecord.find();
  }

  public static getForUser(userId: User['id'], yearAndMonth: Date = new Date()) {
    const start = set(yearAndMonth, {
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const end = set(yearAndMonth, {
      date: getDate(lastDayOfMonth(yearAndMonth)),
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    });
    return TimeRecord.find({
      where: {
        user: userId,
        date: Between(start, end),
      },
    });
  }

  public static async getForTeam(teamId: Team['id'], user: User['id'], yearAndMonth: Date = new Date()) {
    const start = set(yearAndMonth, {
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const end = set(yearAndMonth, {
      date: getDate(lastDayOfMonth(yearAndMonth)),
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    });
    const result = await getConnection()
      .createQueryBuilder()
      .select('tr.id, tr.date, tr.manual, tr."createdAt", tr."updatedAt", tr."deletedAt", team.id as team, umot."userId" as user')
      .from(Team, 'team')
      .leftJoin('user_member_of_team', 'umot', 'umot."teamId" = team.id')
      .leftJoin('time_record', 'tr', 'tr."userId" = umot."userId"')
      .where('team.id = :teamId', { teamId })
      .andWhere('team."leaderId" = :leaderId', {
        leaderId: user,
      })
      .andWhere('tr.id is not null')
      .andWhere('tr.date between :start and :end', {
        start,
        end,
      })
      .getRawMany();
    return result.map(async (item) => ({
      id: item.id,
      date: item.date,
      manual: item.manual,
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
      deletedAt: item.deletedAt,
      user: await User.findOne(item.user),
    }));
  }

  public static async registerTimeRecord(userId: User['id']) {
    const user = await User.findOne(userId, { relations: ['timeRecords'] });
    if (!user) throw new Error('User not found');

    const timeRecord = TimeRecord.create();

    timeRecord.user = user;
    timeRecord.date = new Date();
    timeRecord.manual = false;

    const newTimeRecord = await timeRecord.save();
    user.timeRecords.push(newTimeRecord);

    await user.save();

    return newTimeRecord;
  }

  public static async registerManualTimeRecord(date: Date, userId: User['id']) {
    const user = await User.findOne(userId, { relations: ['timeRecords'] });
    if (!user) throw new Error('User not found');

    const timeRecord = TimeRecord.create();

    timeRecord.user = user;
    timeRecord.date = date;
    timeRecord.manual = true;

    const newTimeRecord = await timeRecord.save();
    user.timeRecords.push(newTimeRecord);

    await user.save();

    return newTimeRecord;
  }

  public static async remove(id: TimeRecord['id'], userId: User['id']) {
    const timeRecord = await TimeRecord.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!timeRecord) throw new Error('Time record not found');
    await TimeRecord.remove(timeRecord);
    return true;
  }
}
