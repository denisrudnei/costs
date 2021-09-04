import bcrypt from 'bcryptjs';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  AfterLoad,
} from 'typeorm';

import { Cost } from './Cost';
import { UserSettings } from './UserSettings';
import { BankAccount } from './BankAccount';
import { Role } from '../enums/Role';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column({ default: Role.USER })
  public role: Role = Role.USER

  @Column({ unique: true })
  @Field()
  public email!: string

  @Column()
  public password!: string

  @Column()
  private tempPassword!: string

  @OneToMany(() => Cost, (Cost) => Cost.user)
  @Field(() => [Cost])
  public costs!: Cost[]

  @OneToOne(() => UserSettings, (UserSettings) => UserSettings.user)
  @JoinColumn()
  @Field(() => UserSettings)
  public settings!: UserSettings

  @OneToOne(() => BankAccount)
  @JoinColumn()
  @Field(() => BankAccount)
  public defaultBankAccount?: BankAccount

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.user)
  @Field(() => [BankAccount])
  public bankAccounts!: BankAccount[]

  @AfterLoad()
  checkPasswordChanged() {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = bcrypt.genSaltSync(12);
      this.password = bcrypt.hashSync(this.password, salt);
    }
    this.tempPassword = '';
  }
}
