import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateNewCost($cost: CostCreateInput!){
  CreateNewCost(cost: $cost) {
    id
    name
    value
    type
  }
}
`;
export default mutation;
