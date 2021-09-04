import ggl from 'graphql-tag';

export const GetBankAccounts = ggl`
query {
  GetBankAccounts {
    id
    name
    agency
    account
  }
}
`;
