import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { KtcDraftPick } from '../../ktc-transaction-asset';
import { SaveAllKtcDraftPicksCommand } from '../save-all-ktc-draft-picks-command';

describe('SaveAllKtcDraftPicksCommand', () => {
  let command: SaveAllKtcDraftPicksCommand;

  let mockDatabaseSet: jest.Mock;

  beforeEach(() => {
    mockDatabaseSet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith('/transaction_assets/ktc/draft_picks')
      .mockReturnValue({
        set: mockDatabaseSet,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    command = new SaveAllKtcDraftPicksCommand(mockFirebaseApp);
  });

  it('should save draft picks to database', async () => {
    const draftPicks: KtcDraftPick[] = [
      {
        id: '1',
        round: 1,
        year: 2000,
      } as KtcDraftPick,
      {
        id: '2',
        round: 2,
        year: 2020,
      } as KtcDraftPick,
    ];

    await command.execute(draftPicks);

    expect(mockDatabaseSet).toBeCalledWith({
      '1': {
        id: '1',
        round: 1,
        year: 2000,
        round_year_index: '1_2000',
      },
      '2': {
        id: '2',
        round: 2,
        year: 2020,
        round_year_index: '2_2020',
      },
    });
  });
});
