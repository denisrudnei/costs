import ggl from 'graphql-tag';

export const RemoveLoan = ggl`
  mutation RemoveLoan($id: ID!) {
    RemoveLoan(id: $id)
  }
`;
