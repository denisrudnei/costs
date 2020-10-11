import { Field, ObjectType } from 'type-graphql';
import { TotalValueSingleDay } from './TotalValueSingleDay';

@ObjectType()
export class SummaryGroupedByDate {
  @Field(() => [TotalValueSingleDay])
  public profits!: TotalValueSingleDay[]

  @Field(() => [TotalValueSingleDay])
  public spending!: TotalValueSingleDay[]
}
