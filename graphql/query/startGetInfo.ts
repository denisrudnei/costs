import ggl from 'graphql-tag';

export const StartGetInfo = ggl`
query {
  StartGetInfo {
    arch
    totalMemory
    freeMemory
    cpus {
      model
      speed
    }
  }
}
`;
