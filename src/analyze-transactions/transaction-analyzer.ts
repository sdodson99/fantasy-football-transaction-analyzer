import { Transaction } from '../transactions/transaction';

/**
 * Service to analyze a transaction.
 */
export class TransactionAnalyzer {
  /**
   * Analyze a transaction.
   * @param transaction The transaction to analyze.
   * @returns The transaction analysis link.
   */
  async analyze(transaction: Transaction): Promise<string> {
    return 'stub-link';
  }
}
