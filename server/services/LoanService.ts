import { Loan } from '../models/Loan';
import { User } from '../models/User';
import { Portion } from '../types/Portion';

export class LoanService {
  public static async getLoans(id: User['id']) {
    return Loan.find({
      where: {
        user: id,
      },
    });
  }

  public static async getLoan(id: Loan['id'], userId: User['id']) {
    const loan = await Loan.findOne({
      where: {
        id,
        user: userId,
      },
    });
    if (!loan) throw new Error('Loan not found');
    return loan;
  }

  public static async create(loan: Loan, userId: User['id']) {
    const user = await User.findOne(userId);
    if (!user) throw new Error('User not found');
    loan.user = user;
    return Loan.save(loan);
  }

  public static async remove(id: Loan['id'], userId: User['id']) {
    const loan = await Loan.findOne({
      where: {
        id,
        user: userId,
      },
    });

    if (!loan) throw new Error('Loan not found');

    await Loan.delete(loan);

    return true;
  }

  public static async edit(loan: Loan, userId: User['id']) {
    const loanToEdit = await Loan.findOne({
      where: {
        id: loan.id,
        user: userId,
      },
    });

    if (!loanToEdit) throw new Error('Loan not found');

    const { id } = loanToEdit;

    Object.assign(loanToEdit, loan);

    loanToEdit.id = id;

    return loanToEdit.save();
  }

  public static async getPortions(id: Loan['id'], userId: User['id']) {
    const loan = await Loan.findOne({
      where: {
        id,
        user: userId,
      },
    });

    if (!loan) throw new Error('Loan not found');

    const portions = Array.from({ length: loan.portions }, (_, i) => i + 1);

    const amortization = loan.total / loan.portions;

    const values: Portion[] = [];

    portions.forEach((portion) => {
      const restValue = loan.total - (amortization * (portion - 1));
      const actualPortion = amortization + ((restValue * loan.interest) / 100);
      const interest = (restValue / 100) * loan.interest;

      const value = {
        number: portion,
        restValue,
        portion: actualPortion,
        paidValue: portion === 1
          ? actualPortion
          : actualPortion + values[values.length - 1].paidValue,
        interest,
        amortizationValue: amortization - (((loan.advanceInterest * portion) * amortization) / 100),
      };

      values.push(value);
    });
    return values;
  }
}
