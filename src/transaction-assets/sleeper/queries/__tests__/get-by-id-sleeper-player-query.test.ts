import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { GetByIdSleeperPlayerQuery } from '../get-by-id-sleeper-player-query';

describe('GetByIdSleeperPlayerQuery', () => {
  let query: GetByIdSleeperPlayerQuery;

  let mockDatabaseGet: jest.Mock;

  let playerId: string;

  beforeEach(() => {
    playerId = '123';

    mockDatabaseGet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith(`/transaction_assets/sleeper/players/${playerId}`)
      .mockReturnValue({
        get: mockDatabaseGet,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    query = new GetByIdSleeperPlayerQuery(mockFirebaseApp);
  });

  it('should return player for ID', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => ({
        id: '1',
      }),
    });

    const result = await query.execute(playerId);

    expect(result).toEqual({
      id: '1',
    });
  });
});
