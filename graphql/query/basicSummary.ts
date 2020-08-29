import ggl from 'graphql-tag'
const query = ggl`
query BasicSummary ($year: Int, $month: Int) {
  BasicSummary(year: $year, month: $month) {
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
    total
  }
}
`

export default query
