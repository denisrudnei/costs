import ggl from 'graphql-tag';

export const GetOneForecast = ggl`
  query GetOneForecast($id: ID!) {
    GetOneForecast (id: $id) {
      id
      name
      start
      end
      indeterminate
      type
      value
    }
  }
`;
