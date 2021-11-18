import { InputType, Field, ID } from 'type-graphql';
import { User } from '../models/User';

@InputType()
export class TeamCreateInput {
  @Field()
  public name!: string

  @Field(() => ID)
  public leader!: User['id']
}
