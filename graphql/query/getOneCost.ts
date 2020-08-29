import ggl from 'graphql-tag'
const query = ggl`
query GetOneCost($id: ID!) {
  GetOneCost(id: $id) {
    id
    name
    value
    date
    type
  }
}
`

export default query
