import * as functions from 'firebase-functions';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';

const sleeperLeagueId = functions.config().sleeperLeague.id;
const nflWeek = 4;

export const watchSleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async (context) => {
    const getSleeperLeagueTransactionsQuery =
      new GetSleeperLeagueTransactionsQuery();

    try {
      functions.logger.info('Querying Sleeper league transactions', {
        leagueId: sleeperLeagueId,
      });

      const sleeperLeagueTransactions =
        await getSleeperLeagueTransactionsQuery.execute(
          sleeperLeagueId,
          nflWeek
        );

      functions.logger.info(
        'Successfully queried Sleeper league transactions.',
        {
          leagueId: sleeperLeagueId,
          transactions: sleeperLeagueTransactions,
        }
      );
    } catch (error) {
      functions.logger.error('Failed to query Sleeper league transactions', {
        leagueId: sleeperLeagueId,
        error,
      });
    }
  });
