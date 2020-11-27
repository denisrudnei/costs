import ggl from 'graphql-tag';

export const ForecastsInMonths = ggl`
query ForecastsInMonths($ids: [ID!]!) {
  ForecastsInMonths(ids: $ids) {
    name
    value
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
