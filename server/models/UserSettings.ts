import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import User from './User'

@ObjectType()
@Entity()
class UserSettings extends BaseEntity {
  constructor(userSettings?: Partial<UserSettings>) {
    super()
    Object.assign(this, userSettings)
  }

  @PrimaryGeneratedColumn()
  public id!: number

  @Field(() => String)
  @Column({ type: 'varchar' })
  public currency!: string

  @Field()
  @Column()
  public locale!: string

  @OneToOne(() => User, (User) => User.settings)
  @Field(() => User)
  public user!: User
}

export default UserSettings
