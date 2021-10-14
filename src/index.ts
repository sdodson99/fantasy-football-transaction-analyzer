import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { GetProcessedTransactionsQuery } from './processed-transactions/queries/get-processed-transactions-query';
import { filterProcessedTransactions } from './processed-transactions/services/filter-processed-transactions';

const firebaseApp = firebase.initializeApp();
const logger = functions.logger;

const sleeperLeagueId = functions.config().sleeperLeague.id;
const nflWeek = 4;

export const notifySleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    logger.info('Starting Sleeper league transactions notifier.', {
      leagueId: sleeperLeagueId,
    });

    const getSleeperLeagueTransactionsQuery =
      new GetSleeperLeagueTransactionsQuery();
    const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
      firebaseApp
    );

    try {
      logger.info('Querying Sleeper league transactions.');

      const sleeperTransactions =
        await getSleeperLeagueTransactionsQuery.execute(
          sleeperLeagueId,
          nflWeek
        );

      logger.info('Successfully queried Sleeper league transactions.', {
        transactions: sleeperTransactions,
      });

      logger.info('Querying processed Sleeper league transactions.');

      const processedSleeperTransactions =
        await getProcessedTransactionsQuery.execute('1', 'sleeper');

      logger.info(
        'Successfully queried processed Sleeper league transactions.',
        {
          processedTransactions: processedSleeperTransactions,
        }
      );

      const unprocessedSleeperTransactions = filterProcessedTransactions(
        sleeperTransactions,
        processedSleeperTransactions
      );

      logger.info(
        'Filtered out already processed Sleeper league transactions.',
        {
          unprocessedTransactions: unprocessedSleeperTransactions,
        }
      );
    } catch (error) {
      logger.error('Failed to process Sleeper league transactions', {
        leagueId: sleeperLeagueId,
        error,
      });
    }
  });
