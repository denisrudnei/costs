import ggl from 'graphql-tag';

export const UpdateTeamName = ggl`
mutation UpdateTeamName($team: ID!, $name: String!) {
  UpdateTeamName(team: $team, name: $name) {
    id
  }
}
`;
