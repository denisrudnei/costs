import ggl from 'graphql-tag';

export const GetWorkSchedule = ggl`
query GetWorkSchedule($year: Int!, $month: Int!) {
  GetWorkSchedule(year: $year, month: $month) {
    workDays {
      id
      day
      start
      finish
    }
    workedDays
    workedHours
  }
}
`;
