import * as firebase from 'firebase-admin';
import { TransactionLeagueType } from '../../transactions/transaction';
import { ProcessedTransaction } from '../processed-transaction';
import { ProcessedTransactionDto } from '../processed-transaction-dto';

/**
 * Command to create a processed transaction.
 */
export class CreateProcessedTransactionCommand {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Create a processed transaction.
   * @param leagueId The ID of the league.
   * @param leagueType The type of the league.
   * @param processedTransaction The processed transaction to create.
   */
  async execute(
    leagueId: string,
    leagueType: TransactionLeagueType,
    processedTransaction: ProcessedTransaction
  ): Promise<void> {
    const processedTransactionsPath = `/processed_transactions/league_types/${leagueType}/leagues/${leagueId}/transactions`;
    const createProcessedTransactionPath = `${processedTransactionsPath}/${processedTransaction.transactionId}`;

    const processedTransactionDto: ProcessedTransactionDto = {
      transactionId: processedTransaction.transactionId,
      type: processedTransaction.type,
      week: processedTransaction.week,
      analysisUrl: processedTransaction.analysisUrl,
      processedEpochMillis: processedTransaction.processedEpochMillis,
    };

    await this.firebaseApp
      .database()
      .ref(createProcessedTransactionPath)
      .set(processedTransactionDto);
  }
}
