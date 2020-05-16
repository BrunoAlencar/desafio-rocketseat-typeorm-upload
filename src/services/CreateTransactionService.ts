import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    category,
    type,
    value,
  }: TransactionDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('You have not enought balance to this transaction');
    }

    const categoryRepostirory = getRepository(Category);
    let categoryExists = await categoryRepostirory.findOne({
      title: category,
    });

    if (!categoryExists) {
      categoryExists = categoryRepostirory.create({
        title: category,
      });
      await categoryRepostirory.save(categoryExists);
    }

    const transaction = transactionsRepository.create({
      title,
      category: categoryExists,
      type,
      value,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
