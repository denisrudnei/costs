import ggl from 'graphql-tag';

const query = ggl`
query {
  GetUsedDates {
    years {
      value
      months
    }
  }
}
`;

export default query;
