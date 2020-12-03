import { CpuInfo } from 'os';
import { Field, Float, ObjectType } from 'type-graphql';

import { CpuInfoType } from './CpuInfoType';

@ObjectType()
export class SystemInfo {
  @Field()
  public arch!: string

  @Field(() => [CpuInfoType])
  public cpus!: CpuInfo[]

  @Field(() => Float)
  public totalMemory!: number

  @Field(() => Float)
  public freeMemory!: number
}
