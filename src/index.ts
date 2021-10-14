import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { GetProcessedTransactionsQuery } from './processed-transactions/queries/get-processed-transactions-query';

const firebaseApp = firebase.initializeApp();
const logger = functions.logger;

const sleeperLeagueId = functions.config().sleeperLeague.id;
const nflWeek = 4;

export const notifySleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    const getSleeperLeagueTransactionsQuery =
      new GetSleeperLeagueTransactionsQuery();
    const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
      firebaseApp
    );

    try {
      logger.info('Querying Sleeper league transactions', {
        leagueId: sleeperLeagueId,
      });

      const sleeperLeagueTransactions =
        await getSleeperLeagueTransactionsQuery.execute(
          sleeperLeagueId,
          nflWeek
        );

      logger.info('Successfully queried Sleeper league transactions.', {
        leagueId: sleeperLeagueId,
        transactions: sleeperLeagueTransactions,
      });

      const processedSleeperLeagueTransactions =
        await getProcessedTransactionsQuery.execute('1', 'sleeper');

      logger.info(processedSleeperLeagueTransactions);
    } catch (error) {
      logger.error('Failed to process Sleeper league transactions', {
        leagueId: sleeperLeagueId,
        error,
      });
    }
  });
