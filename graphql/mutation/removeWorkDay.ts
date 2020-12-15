import ggl from 'graphql-tag';

export const RemoveWorkDay = ggl`
mutation RemoveWorkDay($id: ID!) {
  RemoveWorkDay(id: $id)
}
`;
