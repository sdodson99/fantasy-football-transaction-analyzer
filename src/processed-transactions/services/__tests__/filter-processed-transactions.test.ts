import { Transaction } from '../../../transactions/transaction';
import { ProcessedTransaction } from '../../processed-transaction';
import { filterProcessedTransactions } from '../filter-processed-transactions';

describe('filterProcessedTransactions', () => {
  it('should return transactions without already processed transactions', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
      } as Transaction,
      {
        id: '2',
      } as Transaction,
      {
        id: '3',
      } as Transaction,
    ];
    const processedTransactions: ProcessedTransaction[] = [
      {
        transactionId: '1',
      } as ProcessedTransaction,
      {
        transactionId: '3',
      } as ProcessedTransaction,
    ];

    const result = filterProcessedTransactions(
      transactions,
      processedTransactions
    );

    expect(result).toEqual([
      {
        id: '2',
      },
    ]);
  });
});
