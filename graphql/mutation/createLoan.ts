import ggl from 'graphql-tag';

export const CreateLoan = ggl`
mutation CreateLoan ($loan: LoanCreateInput!){
  CreateLoan (loan: $loan) {
    id
    name
    total
    portions
  }
}
`;
