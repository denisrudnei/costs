import ggl from 'graphql-tag';

const query = ggl`
query {
  Costs {
    id
    name
    value
    type
    date
  }
}`;

export default query;
