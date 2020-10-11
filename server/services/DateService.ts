import { getConnection } from 'typeorm';

import { Cost } from '../models/Cost';
import { User } from '../models/User';
import { UsedDates } from '../types/UsedDates';

class DateService {
  public static async getUsedDates(userId: User['id']): Promise<UsedDates> {
    const result = await getConnection()
      .createQueryBuilder()
      .select('EXTRACT(year from date) as year')
      .addSelect('EXTRACT(month from date) as month')
      .from(Cost, 'cost')
      .where('cost.user = :userId', { userId })
      .groupBy('year')
      .addGroupBy('month')
      .getRawMany();
    const usedDates = new UsedDates();
    result.forEach((item) => {
      if (usedDates.years.map((year) => year.value).includes(item.year)) {
        const year = usedDates.years.find((y) => y.value === item.year);
        year?.months.push(item.month);
      } else {
        usedDates.years.push({
          value: item.year,
          months: [item.month],
        });
      }
    });
    return usedDates;
  }
}

export default DateService;
