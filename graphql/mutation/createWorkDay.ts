import ggl from 'graphql-tag';

export const CreateWorkDay = ggl`
mutation CreateWorkDay($workDay: WorkDayCreateInput!) {
  CreateWorkDay (workDay: $workDay) {
    id
    day
    start
    finish
  }
}
`;
