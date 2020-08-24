import bcrypt from 'bcryptjs'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import Cost from './Cost'

@Entity()
@ObjectType()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column({ unique: true })
  @Field()
  public email!: string

  @Column()
  public password!: string

  @OneToMany(() => Cost, (Cost) => Cost.user)
  @Field(() => [Cost])
  public costs!: Cost[]

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    this.password = bcrypt.hashSync(this.password)
  }
}

export default User
