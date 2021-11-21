import ggl from 'graphql-tag';

export const GetTeam = ggl`
query GetTeam($id: ID!){
  GetTeam(id: $id) {
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
