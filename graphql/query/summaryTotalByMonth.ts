import ggl from 'graphql-tag'
const query = ggl`
query {
  SummaryTotalByMonth {
    year
    month
    total
    type
  }
}
`

export default query
