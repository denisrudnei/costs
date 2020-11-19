import ggl from 'graphql-tag';

const query = ggl`
query {
  User {
    id
    name
    email
  }
}
`;

export default query;
