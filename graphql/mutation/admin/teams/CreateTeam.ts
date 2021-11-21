import ggl from 'graphql-tag';

export const CreateTeam = ggl`
mutation CreateTeam($team: TeamCreateInput!) {
  CreateTeam(team: $team) {
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
