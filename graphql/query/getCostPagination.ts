import ggl from 'graphql-tag';

export const CostPagination = ggl`
query CostPagination ($search: String, $type: String, $order: String, $page: Int, $limit: Int) {
  CostPagination(search: $search, type: $type, order: $order, page: $page, limit: $limit) {
    pages
    page
    limit
    costs {
      id
      name
      date
      value
      type
    }
  }
}
`;
