import { when } from 'jest-when';
import { GetAllKtcStoredTransactionAssetsQuery } from '..';
import { FirebaseStorageJsonFileReader } from '../../../../../core/firebase-storage-json-file-reader';
import { KtcStoredTransactionAsset } from '../ktc-stored-transaction-asset';

describe('GetAllKtcStoredTransactionAssetsQuery', () => {
  let query: GetAllKtcStoredTransactionAssetsQuery;

  let mockJsonFileRead: jest.Mock;

  beforeEach(() => {
    mockJsonFileRead = jest.fn();
    const fileReader = {
      read: mockJsonFileRead,
    } as unknown as FirebaseStorageJsonFileReader;

    query = new GetAllKtcStoredTransactionAssetsQuery(fileReader);
  });

  it('should return mapped players and draft picks', async () => {
    when(mockJsonFileRead)
      .calledWith('ktc-players.json')
      .mockReturnValue([
        {
          playerID: 1,
          playerName: 'Lamar Jackson',
          birthday: '852613200',
          college: 'Louisville',
          position: 'QB',
          team: 'BAL',
        },
        {
          playerID: 2,
          playerName: 'Gus Edwards',
          birthday: '852613200',
          college: 'Miami',
          position: 'RB',
          team: 'BAL',
        },
        {
          playerID: 3,
          playerName: '2022 Early 1st',
          birthday: null,
          college: null,
          position: 'RDP',
          team: 'FA',
        },
      ] as KtcStoredTransactionAsset[]);

    const { players, draftPicks } = await query.execute();

    expect(players).toEqual([
      {
        id: '1',
        firstName: 'Lamar',
        lastName: 'Jackson',
        birthDate: '1997-01-07',
        college: 'Louisville',
        position: 'QB',
        team: 'BAL',
      },
      {
        id: '2',
        firstName: 'Gus',
        lastName: 'Edwards',
        birthDate: '1997-01-07',
        college: 'Miami',
        position: 'RB',
        team: 'BAL',
      },
    ]);
    expect(draftPicks).toEqual([{ id: '3', round: 1, year: 2022 }]);
  });
});
