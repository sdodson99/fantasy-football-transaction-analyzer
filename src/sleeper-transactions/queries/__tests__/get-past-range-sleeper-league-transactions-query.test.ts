import { when } from 'jest-when';
import { Transaction } from '../../../transactions/transaction';
import { GetPastRangeSleeperLeagueTransactionsQuery } from '../get-past-range-sleeper-league-transactions-query';
import { GetSleeperLeagueTransactionsQuery } from '../get-sleeper-league-transactions-query';

describe('GetPastRangeSleeperLeagueTransactionsQuery', () => {
  let query: GetPastRangeSleeperLeagueTransactionsQuery;

  let mockGetSleeperLeagueTransactionsQueryExecute: jest.Mock;
  let pastRangeCount: number;

  let leagueId: string;

  beforeEach(() => {
    mockGetSleeperLeagueTransactionsQueryExecute = jest.fn();
    const getSleeperLeagueTransactionsQuery = {
      execute: mockGetSleeperLeagueTransactionsQueryExecute,
    } as unknown as GetSleeperLeagueTransactionsQuery;

    pastRangeCount = 2;

    query = new GetPastRangeSleeperLeagueTransactionsQuery(
      getSleeperLeagueTransactionsQuery,
      pastRangeCount
    );

    leagueId = '123';
  });

  it('should return transactions for current week and range of previous weeks', async () => {
    when(mockGetSleeperLeagueTransactionsQueryExecute)
      .calledWith(leagueId, expect.any(Number))
      .mockImplementation((_, week) => [
        { id: week.toString() } as Transaction,
      ]);

    const transactions = await query.execute(leagueId, 4);

    expect(transactions).toEqual([
      {
        id: '2',
      },
      {
        id: '3',
      },
      {
        id: '4',
      },
    ]);
  });

  it('should not query for transactions if week is less than 1', async () => {
    await query.execute(leagueId, 2);

    expect(mockGetSleeperLeagueTransactionsQueryExecute).not.toBeCalledWith(
      leagueId,
      0
    );
    expect(mockGetSleeperLeagueTransactionsQueryExecute).toBeCalledWith(
      leagueId,
      1
    );
  });
});
