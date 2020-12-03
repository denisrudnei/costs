import ggl from 'graphql-tag';

export const GetEverySecond = ggl`
subscription {
  GetEverySecond {
    arch
    totalMemory
    freeMemory
    cpus {
      model
      speed
      times {
        user
      }
    }
  }
}
`;
