import ggl from 'graphql-tag'
const query = ggl`
query SummaryGroupedByDate ($year: Int, $month: Int) {
  SummaryGroupedByDate (year: $year, month: $month) {
    spending {
      date
      total
    }
    profits {
      date
      total
    }
  }
}
`

export default query
