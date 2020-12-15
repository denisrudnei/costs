import ggl from 'graphql-tag';

export const GetWorkDay = ggl`
  query GetWorkDay($year: Int, $month: Int) {
    GetWorkDay (year: $year, month: $month) {
      id
      day
      start
      finish
    }
  }
`;
