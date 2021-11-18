import bcrypt from 'bcryptjs';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../enums/Role';
import { BankAccount } from './BankAccount';
import { Cost } from './Cost';
import { Team } from './Team';
import { TimeRecord } from './TimeRecord';
import { UserSettings } from './UserSettings';

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

  @OneToMany(() => TimeRecord, (time) => time.user)
  @Field(() => [TimeRecord])
  public timeRecords!: TimeRecord[]

  @OneToMany(() => Team, (team) => team.leader)
  @Field(() => [Team])
  @JoinColumn()
  public leaderOf!: Team[]

  @ManyToMany(() => Team, (team) => team.members)
  @Field(() => [Team])
  @JoinTable()
  public memberOf!: Team[]

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
