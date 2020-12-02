import ggl from 'graphql-tag';

export const GetLoans = ggl`
  query {
    GetLoans {
      id
      name
      total
      interest
      portions
      advanceInterest
    }
  }
`;
