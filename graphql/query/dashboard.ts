import ggl from 'graphql-tag';

export const dashboard = ggl`
  query {
    Dashboard {
      quantities {
        name
        total
      }
    }
  }
`;
