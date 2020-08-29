import ggl from 'graphql-tag'
const mutation = ggl`
mutation RemoveCost($id: ID!) {
  RemoveCost(id: $id)
}
`

export default mutation
