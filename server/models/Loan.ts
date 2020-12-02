import {
  Field, Float, Int, ID, ObjectType,
} from 'type-graphql';
import {
  Column, BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
@ObjectType()
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  public interest: number = 0

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  public advanceInterest: number = 0

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  public total: number = 0

  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  public portions: number = 0

  @Field(() => Float)
  public get amortization() {
    return this.total / this.portions;
  }

  @ManyToOne(() => User)
  public user!: User
}
