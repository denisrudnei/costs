import ggl from 'graphql-tag';

export const UpdateLeaderForTeam = ggl`
mutation UpdateLeaderForTeam($team: ID!, $user: ID!) {
  UpdateLeaderForTeam(team: $team, user: $user) {
    id
  }
}
`;
