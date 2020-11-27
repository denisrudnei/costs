import ggl from 'graphql-tag';

export const GetForecast = ggl`
  query {
    GetForecast {
      id
      name
      start
      end
      value
    }
  }
`;
