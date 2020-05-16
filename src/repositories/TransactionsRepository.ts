import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = await this.find();

    const totalIncome = transactionsRepository.reduce((sum, transaction) => {
      if (transaction.type === 'income') return sum + Number(transaction.value);
      return sum;
    }, 0);
    const totalOutcome = transactionsRepository.reduce((sum, transaction) => {
      if (transaction.type === 'outcome')
        return sum + Number(transaction.value);
      return sum;
    }, 0);

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
  }
}

export default TransactionsRepository;
