import { TransactionLeagueType } from '../../../transactions/transaction';
import { GetProcessedTransactionsQuery } from '../get-processed-transactions-query';
import * as firebase from 'firebase-admin';
import { when } from 'jest-when';

describe('GetProcessedTransactionsQuery', () => {
  let query: GetProcessedTransactionsQuery;

  let mockDatabaseGet: jest.Mock;

  let leagueId: string;
  let leagueType: TransactionLeagueType;

  beforeEach(() => {
    leagueId = '123';
    leagueType = 'sleeper';

    mockDatabaseGet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith(
        `/processed_transactions/league_types/${leagueType}/leagues/${leagueId}/transactions`
      )
      .mockReturnValue({
        get: mockDatabaseGet,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    query = new GetProcessedTransactionsQuery(mockFirebaseApp);
  });

  it('should return processed transactions from database', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => ({
        '123': {
          analysisUrl: 'test.com',
          processedTimestamp: 123,
          transactionId: '123',
          week: 4,
        },
        '456': {
          analysisUrl: 'test2.com',
          processedTimestamp: 123,
          transactionId: '456',
          week: 3,
        },
      }),
    });

    const result = await query.execute(leagueId, leagueType);

    expect(result).toEqual([
      {
        analysisUrl: 'test.com',
        processedTimestamp: 123,
        transactionId: '123',
        week: 4,
        leagueId: '123',
        leagueType: 'sleeper',
      },
      {
        analysisUrl: 'test2.com',
        processedTimestamp: 123,
        transactionId: '456',
        week: 3,
        leagueId: '123',
        leagueType: 'sleeper',
      },
    ]);
  });
});
