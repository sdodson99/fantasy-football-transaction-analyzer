import * as firebase from 'firebase-admin';
import { TransactionLeagueType } from '../../transactions/transaction';
import { ProcessedTransaction } from '../processed-transaction';

export type ProcessedTransactionDto = {
  transactionId: string;
  week: number;
  analysisUrl: string;
  processedTimestamp: number;
};

/**
 * Query for processed transactions.
 */
export class GetProcessedTransactionsQuery {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Get processed transactions for a league.
   * @param leagueId The ID of the league.
   * @param leagueType The type of the league.
   * @returns The processed transactions for the league.
   */
  async execute(
    leagueId: string,
    leagueType: TransactionLeagueType
  ): Promise<ProcessedTransaction[]> {
    const processedTransactionsPath = `/processed_transactions/league_types/${leagueType}/leagues/${leagueId}/transactions`;

    const processedTransactionsData = await this.firebaseApp
      .database()
      .ref(processedTransactionsPath)
      .get();

    const processedTransactionsValue = processedTransactionsData.val();
    const processedTransactionDtos: ProcessedTransactionDto[] = Object.values(
      processedTransactionsValue
    );

    return processedTransactionDtos.map((t) => ({
      ...t,
      leagueId,
      leagueType,
    }));
  }
}
