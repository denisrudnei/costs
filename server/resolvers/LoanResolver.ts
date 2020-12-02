import {
  Arg, Authorized, Ctx, ID, Mutation, Query, Resolver,
} from 'type-graphql';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { Loan } from '../models/Loan';
import { LoanService } from '../services/LoanService';
import { LoanCreateInput } from '../inputs/LoanCreateInput';
import { Portion } from '../types/Portion';
import { LoanEditInput } from '../inputs/LoanEditInput';

@Resolver(() => Loan)
export class LoanResolver {
  @Query(() => [Loan])
  @Authorized('user')
  public GetLoans(@Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.getLoans(id);
  }

  @Query(() => Loan)
  @Authorized('user')
  public GetLoan(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.getLoan(loanId, id);
  }

  @Query(() => [Portion])
  @Authorized('user')
  public GetPortions(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.getPortions(loanId, id);
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  public RemoveLoan(@Arg('id', () => ID) loanId: Loan['id'], @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.remove(loanId, id);
  }

  @Mutation(() => Loan)
  @Authorized('user')
  public EditLoan(@Arg('loan', () => LoanEditInput) loan: Loan, @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.edit(loan, id);
  }

  @Mutation(() => Loan)
  @Authorized('user')
  public CreateLoan(@Arg('loan', () => LoanCreateInput) loan: Loan, @Ctx() { req }: ExpressContext) {
    const { id } = req.session!.authUser;
    return LoanService.create(loan, id);
  }
}
