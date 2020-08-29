import ggl from 'graphql-tag'
const mutation = ggl`
mutation Register($email: String!, $name: String!, $password: String!) {
  Register(email: $email, name: $name, password: $password) {
    id
    name
    email
  }
}
`

export default mutation
