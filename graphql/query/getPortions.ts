import ggl from 'graphql-tag';

export const GetPortions = ggl`
query GetPortions($id: ID!) {
  GetLoan(id: $id) {
    name
    total
    interest
    portions
    advanceInterest
  }
  GetPortions (id: $id) {
    number
    portion
    restValue
    paidValue
    interest
    amortizationValue
  }
}
`;
