import bcrypt from 'bcryptjs'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

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

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    this.password = bcrypt.hashSync(this.password)
  }
}

export default User
