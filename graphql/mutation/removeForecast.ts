import ggl from 'graphql-tag';

export const RemoveForecast = ggl`
  mutation RemoveForecast($id: ID!) {
    RemoveForecast(id: $id)
  }
`;
