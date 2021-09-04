import { SelectQueryBuilder } from 'typeorm';
import { BankAccount } from '../models/BankAccount';
import { User } from '../models/User';
import { BankAccountCreateInput } from '../inputs/BankAccountCreateInput';

export class BankAccountService {
  public static async getDefaultAccount(userId: User['id']) {
    const user = await User.findOne(userId, { relations: ['defaultBankAccount', 'bankAccounts'] });
    if (!user) throw new Error('User not found');

    if (user.defaultBankAccount) return user.defaultBankAccount;
    if (user.bankAccounts.length) {
      const [defaultAccount] = user.bankAccounts;
      user.defaultBankAccount = defaultAccount;
      await user.save();
      return user.defaultBankAccount;
    }

    const defaultAccount = BankAccount.create();
    defaultAccount.name = `Default bank account for  ${user.name}`;
    defaultAccount.agency = 'Default agency';
    defaultAccount.account = 'Default account number';
    defaultAccount.user = user;
    return defaultAccount.save();
  }

  public static async create(userId: User['id'], account: BankAccountCreateInput) {
    const user = await User.findOne(userId, { relations: ['bankAccounts'] });
    if (!user) throw new Error('User not found');
    const newAccount = BankAccount.create();
    Object.assign(newAccount, account);
    newAccount.user = user;
    return newAccount.save();
  }

  public static async getBankAccounts(userId: User['id']) {
    const user = await User.findOne(userId, { relations: ['bankAccounts'] });
    if (!user) throw new Error('User not found');
    return user.bankAccounts;
  }

  public static async remove(userId: User['id'], id: BankAccount['id']) {
    const bankAccount = await BankAccount.findOne(id, {
      join: {
        alias: 'bank_account',
        leftJoinAndSelect: {
          user: 'bank_account.user',
        },
      },
      where: (qb: SelectQueryBuilder<BankAccount>) => {
        qb.where('bank_account.user = :userId', { userId });
      },
    });
    if (!bankAccount) throw new Error('Bank account not found');
    await BankAccount.delete(bankAccount);
    return true;
  }
}
