import * as functions from 'firebase-functions';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';

const sleeperLeagueId = functions.config().sleeperLeague.id;
const nflWeek = 4;

const logger = functions.logger;

export const notifySleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    const getSleeperLeagueTransactionsQuery =
      new GetSleeperLeagueTransactionsQuery();

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
    } catch (error) {
      logger.error('Failed to process Sleeper league transactions', {
        leagueId: sleeperLeagueId,
        error,
      });
    }
  });
