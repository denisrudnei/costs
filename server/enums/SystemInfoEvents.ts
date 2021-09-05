import { registerEnumType } from 'type-graphql';

export enum SystemInfoEvents {
  GET_EVERY_SYSTEM_INFO = 'GET_EVERY_SYSTEM_INFO'
}

registerEnumType(SystemInfoEvents, {
  name: 'SystemInfoEvents',
});
