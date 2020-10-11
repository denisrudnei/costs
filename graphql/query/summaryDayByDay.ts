import ggl from 'graphql-tag';

const query = ggl`
query SummaryDayByDay($month: Int, $year: Int) {
  SummaryDayByDay(month: $month, year: $year) {
    day
    total
  }
}
`;

export default query;
