import ggl from 'graphql-tag';

export const RemoveUserForTeam = ggl`
mutation RemoveUserForTeam($team: ID!, $user: ID!) {
  RemoveUserForTeam(team: $team, user: $user) {
    id
    name
  }
}
`;
