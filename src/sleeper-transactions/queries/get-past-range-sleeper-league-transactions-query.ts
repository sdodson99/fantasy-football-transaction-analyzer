import { Transaction } from '../../transactions/transaction';
import { GetSleeperLeagueTransactionsQuery } from './get-sleeper-league-transactions-query';

/**
 * Query for transactions in a Sleeper league across multiple previous week.
 *
 * This is experimental to make sure we don't miss pending transactions from
 * previous weeks.
 */
export class GetPastRangeSleeperLeagueTransactionsQuery {
  /**
   * Initialize with queries and settings.
   * @param pastRangeCount The number of weeks to go back.
   */
  constructor(
    private getSleeperLeagueTransactionsQuery: GetSleeperLeagueTransactionsQuery,
    private pastRangeCount: number = 1
  ) {}

  /**
   * Get transactions for a league for the NFL week.
   * @param leagueId The ID of the league.
   * @param week The week for the transactions.
   * @returns The transactions for the NFL week in the league.
   */
  async execute(leagueId: string, week: number): Promise<Transaction[]> {
    const minWeek = week - this.pastRangeCount;
    const maxWeek = week;

    const sleeperLeagueTransactionsQueries: Promise<Transaction[]>[] = [];
    for (let currentWeek = minWeek; currentWeek <= maxWeek; currentWeek++) {
      if (currentWeek > 0) {
        sleeperLeagueTransactionsQueries.push(
          this.getSleeperLeagueTransactionsQuery.execute(leagueId, currentWeek)
        );
      }
    }

    const queryResults = await Promise.all(sleeperLeagueTransactionsQueries);

    return queryResults.flat();
  }
}
