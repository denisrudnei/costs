import ggl from 'graphql-tag'
const query = ggl`
query {
  GetSpending {
    id
    value
    type
    date
  }
}
`

export default query
