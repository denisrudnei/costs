import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}

export default UserSettings
