import { Field, ObjectType } from 'type-graphql';
import { Times } from './Times';
@ObjectType()
export class CpuInfoType {
  @Field()
  model!: string

  @Field()
  speed!: number

  @Field(() => Times)
  times!: Times
}
