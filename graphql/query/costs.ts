import ggl from 'graphql-tag'

const query = ggl`
query {
  Costs {
    id
    value
    type
    date
  }
}`

export default query
