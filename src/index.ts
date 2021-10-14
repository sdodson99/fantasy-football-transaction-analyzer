import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { GetProcessedTransactionsQuery } from './processed-transactions/queries/get-processed-transactions-query';
import { filterProcessedTransactions } from './processed-transactions/services/filter-processed-transactions';
import { TransactionAnalyzer } from './analyze-transactions/transaction-analyzer';
import { CreateProcessedTransactionCommand } from './processed-transactions/commands/create-processed-transaction-command';
import { TransactionLeagueType } from './transactions/transaction';
import { ProcessedTransaction } from './processed-transactions/processed-transaction';
import { DateTime } from 'luxon';

const firebaseApp = firebase.initializeApp();
const logger = functions.logger;

const leagueId = functions.config().sleeperLeague.id;
const leagueType: TransactionLeagueType = 'sleeper';
const nflWeek = 4;

export const notifySleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    logger.info('Starting Sleeper league transactions notifier.', {
      leagueId,
    });

    const getLeagueTransactionsQuery = new GetSleeperLeagueTransactionsQuery();
    const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
      firebaseApp
    );
    const transactionAnalyzer = new TransactionAnalyzer();
    const createProcessedTransactionCommand =
      new CreateProcessedTransactionCommand(firebaseApp);

    try {
      logger.info('Querying league transactions.');

      const transactions = await getLeagueTransactionsQuery.execute(
        leagueId,
        nflWeek
      );

      logger.info('Successfully queried league transactions.', {
        transactionCount: transactions.length,
      });

      logger.info('Querying processed league transactions.');

      const processedTransactions = await getProcessedTransactionsQuery.execute(
        leagueId,
        leagueType
      );

      logger.info('Successfully queried processed league transactions.', {
        processedTransactionsCount: processedTransactions.length,
      });

      logger.info('Filtering out already processed league transactions.');

      const unprocessedTransactions = filterProcessedTransactions(
        transactions,
        processedTransactions
      );

      logger.info('Filtered out already processed league transactions.', {
        unprocessedTransactionsCount: unprocessedTransactions.length,
      });

      if (unprocessedTransactions.length === 0) {
        return logger.info('No transactions to process.', {
          unprocessedTransactionsCount: unprocessedTransactions.length,
        });
      }

      for (let index = 0; index < unprocessedTransactions.length; index++) {
        const currentUnprocessedTransaction = unprocessedTransactions[index];

        logger.info('Analyzing transaction.', {
          transactionId: currentUnprocessedTransaction.id,
        });

        const transactionAnalysisUrl = await transactionAnalyzer.analyze(
          currentUnprocessedTransaction
        );

        logger.info('Successfully analyzed transaction.', {
          analysisUrl: transactionAnalysisUrl,
        });

        logger.info('Completing transaction.');

        const processedTransaction: ProcessedTransaction = {
          transactionId: currentUnprocessedTransaction.id,
          type: currentUnprocessedTransaction.type,
          leagueId,
          leagueType,
          week: currentUnprocessedTransaction.week,
          analysisUrl: transactionAnalysisUrl,
          processedEpochMillis: DateTime.now().toMillis(),
        };
        await createProcessedTransactionCommand.execute(
          leagueId,
          leagueType,
          processedTransaction
        );

        logger.info('Successfully completed transaction.');
      }
    } catch (error) {
      logger.error('Failed to notify Sleeper league transactions.', {
        leagueId: leagueId,
        error,
      });
    }
  });
