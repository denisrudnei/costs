import ggl from 'graphql-tag';

export const EditForecast = ggl`
  mutation EditForecast($id: ID!, $forecast: ForecastEditInput!) {
    EditForecast(id: $id, forecast: $forecast) {
      id
      name
      value
      start
      end
      indeterminate
    }
  }
`;
