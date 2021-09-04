import {
  Arg, Authorized, Ctx, ID, Mutation, Query, Resolver,
} from 'type-graphql';

import { Role } from '../enums/Role';
import { BankAccountCreateInput } from '../inputs/BankAccountCreateInput';
import { BankAccount } from '../models/BankAccount';
import { BankAccountService } from '../services/BankAccountService';
import { CustomExpressContext } from '../types/CustomSession';

@Resolver()
export class BankAccountResolver {
  @Query(() => [BankAccount])
  @Authorized(Role.USER)
  public GetBankAccounts(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return BankAccountService.getBankAccounts(id);
  }

  @Query(() => BankAccount)
  @Authorized(Role.USER)
  public GetDefaultBankAccount(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return BankAccountService.getDefaultAccount(id);
  }

  @Mutation(() => BankAccount)
  @Authorized(Role.USER)
  public CreateBankAccount(@Arg('account', () => BankAccountCreateInput) account: BankAccountCreateInput, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return BankAccountService.create(id, account);
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveBankAccount(@Arg('id', () => ID) bankAccount: BankAccount['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session.authUser!;
    return BankAccountService.remove(id, bankAccount);
  }
}
