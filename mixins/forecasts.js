import { parse, differenceInMonths } from 'date-fns';

export default {
  methods: {
    getMonths(startDate, endDate) {
      const start = parse(startDate, 'yyyy-MM-dd', new Date());

      const end = parse(endDate, 'yyyy-MM-dd', new Date());

      return Math.abs(differenceInMonths(start, end));
    },
  },
};
