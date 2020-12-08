import ggl from 'graphql-tag';

export const CostPagination = ggl`
query CostPagination ($page: Int!, $limit: Int) {
  CostPagination(page: $page, limit: $limit) {
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
