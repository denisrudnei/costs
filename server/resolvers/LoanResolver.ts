import {
  Arg, Authorized, Ctx, ID, Mutation, Query, Resolver,
} from 'type-graphql';

import { LoanCreateInput } from '../inputs/LoanCreateInput';
import { LoanEditInput } from '../inputs/LoanEditInput';
import { Loan } from '../models/Loan';
import { Role } from '../enums/Role';
import { LoanService } from '../services/LoanService';
import { CustomExpressContext } from '../types/CustomSession';
import { Portion } from '../types/Portion';

@Resolver(() => Loan)
export class LoanResolver {
  @Query(() => [Loan])
  @Authorized(Role.USER)
  public GetLoans(@Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.getLoans(id);
  }

  @Query(() => Loan)
  @Authorized(Role.USER)
  public GetLoan(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.getLoan(loanId, id);
  }

  @Query(() => [Portion])
  @Authorized(Role.USER)
  public GetPortions(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.getPortions(loanId, id);
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveLoan(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.remove(loanId, id);
  }

  @Mutation(() => Loan)
  @Authorized(Role.USER)
  public EditLoan(@Arg('loan', () => LoanEditInput) loan: Loan, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.edit(loan, id);
  }

  @Mutation(() => Loan)
  @Authorized(Role.USER)
  public CreateLoan(@Arg('loan', () => LoanCreateInput) loan: Loan, @Ctx() { req }: CustomExpressContext) {
    const { id } = req.session!.authUser!;
    return LoanService.create(loan, id);
  }
}
