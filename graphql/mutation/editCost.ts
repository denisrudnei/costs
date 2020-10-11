import ggl from 'graphql-tag';

const mutation = ggl`
mutation EditCost($id: ID!, $cost: CostEditInput!) {
  EditCost(id: $id, cost: $cost) {
    name
    id
    value
    date
    type
  }
}
`;

export default mutation;
