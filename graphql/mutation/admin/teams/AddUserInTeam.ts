import ggl from 'graphql-tag';

export const AddUserInTeam = ggl`
mutation AddUserInTeam($team: ID!, $user: ID!) {
  AddUserInTeam(team: $team, user: $user) {
    id
    name
    members {
      id
      name
      email
    }
  }
}
`;
