import ggl from 'graphql-tag'
const query = ggl`
query {
  UserSettings {
    locale
    currency
  }
}
`

export default query
