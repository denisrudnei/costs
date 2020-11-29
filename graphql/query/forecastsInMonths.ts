import ggl from 'graphql-tag';

export const ForecastsInMonths = ggl`
query ForecastsInMonths($ids: [ID!]!, $months: Int) {
  ForecastsInMonths(ids: $ids, months: $months) {
    name
    value
    indeterminate
    total
    start
    end
    values {
      name
      date
      value
    }
  }
}
`;
