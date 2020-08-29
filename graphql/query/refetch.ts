import ggl from 'graphql-tag'
const query = ggl`
query {
  Costs {
    id
    value
  }
  GetProfits {
    id
    value
  }
  GetSpending {
    id
    value
  }
}
`

export default query
