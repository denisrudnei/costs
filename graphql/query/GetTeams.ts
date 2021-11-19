import ggl from 'graphql-tag';

export const GetTeams = ggl`
query {
  GetTeams {
    id
    name
    leader {
      id
      name
      email
    }
    members {
      id
      name
      email
    }
  }
}
`;
