import ggl from 'graphql-tag';

export const GetLoan = ggl`
  query GetLoan($id: ID!) {
    GetLoan(id: $id) {
      id
      name
      total
      interest
      portions
      advanceInterest
    }
  }
`;
