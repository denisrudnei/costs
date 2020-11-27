import ggl from 'graphql-tag';

export const TotalForecastInMonths = ggl`
query TotalForecastInMonths($ids: [ID!]!){
  TotalForecastInMonths(ids: $ids) {
    names
    date
    total
  }
}
`;
