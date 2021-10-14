import { Transaction } from '../../transactions/transaction';
import { ProcessedTransaction } from '../processed-transaction';

/**
 * Filter out already processed transactions from a collection of transactions.
 * @param transactions The transactions to filter.
 * @param processedTransactions The already processed transctions.
 * @returns The transactions with already processed transactions filtered out.
 */
export const filterProcessedTransactions = (
  transactions: Transaction[],
  processedTransactions: ProcessedTransaction[]
): Transaction[] => {
  const processedTransactionIdsSet = new Set(
    processedTransactions.map((t) => t.transactionId)
  );

  return transactions.filter((t) => !processedTransactionIdsSet.has(t.id));
};
