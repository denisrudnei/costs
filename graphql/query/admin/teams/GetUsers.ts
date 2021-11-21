import ggl from 'graphql-tag';

export const GetUsers = ggl`
query {
  User {
    id
    name
    email
  }
}
`;
