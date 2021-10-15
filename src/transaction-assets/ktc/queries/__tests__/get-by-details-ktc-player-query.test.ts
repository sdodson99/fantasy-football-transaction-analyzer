import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { GetByDetailsKtcPlayerQuery } from '../get-by-details-ktc-player-query';

describe('GetByDetailsKtcPlayerQuery', () => {
  let query: GetByDetailsKtcPlayerQuery;

  let mockDatabaseGet: jest.Mock;

  let firstName: string;
  let lastName: string;
  let birthDate: string;

  beforeEach(() => {
    firstName = 'firstName';
    lastName = 'lastName';
    birthDate = 'birthDate';

    mockDatabaseGet = jest.fn();
    const mockLimitToFirst = jest.fn();
    when(mockLimitToFirst).calledWith(1).mockReturnValue({
      get: mockDatabaseGet,
    });
    const mockEqualTo = jest.fn();
    when(mockEqualTo)
      .calledWith('firstName_lastName_birthDate')
      .mockReturnValue({
        limitToFirst: mockLimitToFirst,
      });
    const mockOrderByChild = jest.fn();
    when(mockOrderByChild)
      .calledWith('firstName_lastName_birthDate_index')
      .mockReturnValue({
        equalTo: mockEqualTo,
      });
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith('/transaction_assets/ktc/players')
      .mockReturnValue({
        orderByChild: mockOrderByChild,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    query = new GetByDetailsKtcPlayerQuery(mockFirebaseApp);
  });

  it('should return player for details', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => ({
        1: {
          id: '1',
        },
      }),
    });

    const result = await query.execute(firstName, lastName, birthDate);

    expect(result).toEqual({
      id: '1',
    });
  });

  it('should return null if player not found', async () => {
    mockDatabaseGet.mockReturnValue({
      val: () => null,
    });

    const result = await query.execute(firstName, lastName, birthDate);

    expect(result).toBeNull();
  });
});
