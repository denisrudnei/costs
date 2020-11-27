import ggl from 'graphql-tag';

export const createForecast = ggl`
mutation CreateForecast($forecast: ForecastInput!) {
  CreateForecast(forecast: $forecast) {
    id
    name
    start
    end
    value
  }
}
`;
