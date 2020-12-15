import { Field, ObjectType } from 'type-graphql';
import { WorkDay } from './WorkDay';

@ObjectType()
export class WorkSchedule {
  @Field()
  public workedDays!: number

  @Field()
  public workedHours!: number

  @Field(() => [WorkDay])
  public workDays!: WorkDay[]
}
