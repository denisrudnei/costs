import ggl from 'graphql-tag';

export const CreateBankAccount = ggl`
mutation CreateBankAccount($account: BankAccountCreateInput!) {
  CreateBankAccount(account: $account) {
    id
    name
    agency
    account
  }
}
`;
