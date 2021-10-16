import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { GetByDetailsKtcDraftPickQuery } from '../get-by-details-ktc-draft-pick-query';

describe('GetByDetailsKtcDraftPickQuery', () => {
  let query: GetByDetailsKtcDraftPickQuery;

  let mockDatabaseGet: jest.Mock;

  let round: number;
  let year: number;

  beforeEach(() => {
    round = 1;
    year = 2022;

    mockDatabaseGet = jest.fn();
    const mockLimitToFirst = jest.fn();
    when(mockLimitToFirst).calledWith(1).mockReturnValue({
      get: mockDatabaseGet,
    });
    const mockEqualTo = jest.fn();
    when(mockEqualTo).calledWith('1_2022').mockReturnValue({
      limitToFirst: mockLimitToFirst,
    });
    const mockOrderByChild = jest.fn();
    when(mockOrderByChild).calledWith('round_year_index').mockReturnValue({
      equalTo: mockEqualTo,
    });
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith('/transaction_assets/ktc/draft_picks')
      .mockReturnValue({
        orderByChild: mockOrderByChild,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    query = new GetByDetailsKtcDraftPickQuery(mockFirebaseApp);
  });

  it('should return draft pick for details', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => ({
        1: {
          id: '1',
        },
      }),
    });

    const result = await query.execute(round, year);

    expect(result).toEqual({
      id: '1',
    });
  });

  it('should return null if draft pick not found', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => null,
    });

    const result = await query.execute(round, year);

    expect(result).toBeNull();
  });
});
