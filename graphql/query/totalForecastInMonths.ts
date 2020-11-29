import ggl from 'graphql-tag';

export const TotalForecastInMonths = ggl`
query TotalForecastInMonths($ids: [ID!]!, $start: DateTime!, $end: DateTime!){
  TotalForecastInMonths(ids: $ids, start: $start, end: $end) {
    names
    date
    total
  }
}
`;
