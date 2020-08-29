import ggl from 'graphql-tag'
const query = ggl`
query {
  GetProfits {
   id
   value
   type
   date
 }
}
`

export default query
