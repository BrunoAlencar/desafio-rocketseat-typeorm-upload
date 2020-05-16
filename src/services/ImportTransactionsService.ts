import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const transactionsFilePath = path.join(uploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(transactionsFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const newTransactions: any[] = [];

    parseCSV.on('data', line => {
      newTransactions.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    const savedTransactions: Transaction[] = [];
    await newTransactions.forEach(async (transaction: any[]) => {
      const savedTransaction = await createTransactionService.execute({
        title: transaction[0],
        type: transaction[1],
        value: transaction[2],
        category: transaction[3],
      });

      savedTransactions.push(savedTransaction);
    });

    await fs.promises.unlink(transactionsFilePath);

    return savedTransactions;
  }
}

export default ImportTransactionsService;
