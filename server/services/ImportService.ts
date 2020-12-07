import { Formats } from '@/enums/ImportFile/Formats';
import { parse } from 'date-fns';
import { UploadedFile } from 'express-fileupload';
import { Cost } from '~/models/Cost';

import CostType from '../enums/CostType';
import { Separators } from '../enums/ImportFile/Separators';
import { User } from '../models/User';
import CostService from './CostService';

export class ImportService {
  private static convertToTable(file: UploadedFile, separator: Separators) {
    const fullLines = file.data.toString().split('\n');
    const linesWithColumns = fullLines.map((line) => line.split(separator));
    return linesWithColumns.filter((line) => line[0].length > 0);
  }

  public static async save(
    files: UploadedFile | UploadedFile[],
    user: User,
    format = Formats.DAY_MONTH_YEAR,
    separator = Separators.SEMICOLON,
    merge = false,
  ) {
    let data;
    if ('length' in files) {
      data = files.flatMap((file) => this.convertToTable(file, separator));
    } else {
      data = this.convertToTable(files, separator);
    }

    const costs = data.map((item) => {
      const [date, name, value] = item;
      const newValue = parseFloat(value.replace(',', '.'));
      const cost = new Cost({
        name,
        value: newValue,
        type: newValue < 0 ? CostType.SPENT : CostType.PROFIT,
        date: parse(date, format, new Date()),
        user,
      });

      return cost;
    });

    let saveAll;

    if (merge) {
      const items = await CostService.getNotDuplicates(costs);
      saveAll = items.map((item) => item.save());
    } else {
      saveAll = costs.map((cost) => Cost.save(cost));
    }

    await Promise.all(saveAll);
    return costs;
  }
}
