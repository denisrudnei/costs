import ggl from 'graphql-tag';

export const RemoveBankAccount = ggl`
mutation RemoveBankAccount($id: ID!) {
  RemoveBankAccount(id: $id)
}
`;
