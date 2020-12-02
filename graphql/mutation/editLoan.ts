import ggl from 'graphql-tag';

export const EditLoan = ggl`
mutation EditLoan($loan: LoanEditInput!) {
  EditLoan(loan: $loan) {
    id
    name
    total
    interest
    portions
    advanceInterest
  }
}
`;
