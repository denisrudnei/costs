import ggl from 'graphql-tag';

const query = ggl`
query BasicSummary ($useLastMonthBalance: Boolean, $year: Int, $month: Int) {
  BasicSummary(useLastMonthBalance: $useLastMonthBalance, year: $year, month: $month) {
    spending {
      sum
      values {
        id
        name
        value
        date
        type
      }
    }
    profits {
      sum
      values {
        id
        name
        value
        date
        type
      }
    }
    lastMonthBalance {
      type
      value
      name
      date
    }
    total
  }
}
`;

export default query;
