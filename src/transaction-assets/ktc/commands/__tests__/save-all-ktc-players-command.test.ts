import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { KtcPlayer } from '../../ktc-transaction-asset';
import { SaveAllKtcPlayersCommand } from '../save-all-ktc-players-command';

describe('SaveAllKtcPlayersCommand', () => {
  let command: SaveAllKtcPlayersCommand;

  let mockDatabaseSet: jest.Mock;

  beforeEach(() => {
    mockDatabaseSet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith('/transaction_assets/ktc/players')
      .mockReturnValue({
        set: mockDatabaseSet,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    command = new SaveAllKtcPlayersCommand(mockFirebaseApp);
  });

  it('should save players to database', async () => {
    const players: KtcPlayer[] = [
      {
        id: '1',
        firstName: 'firstName1',
        lastName: 'lastName1',
        birthDate: 'birthDate1',
      } as KtcPlayer,
      {
        id: '2',
        firstName: 'firstName2',
        lastName: 'lastName2',
        birthDate: 'birthDate2',
      } as KtcPlayer,
    ];

    await command.execute(players);

    expect(mockDatabaseSet).toBeCalledWith({
      '1': {
        id: '1',
        firstName: 'firstName1',
        lastName: 'lastName1',
        birthDate: 'birthDate1',
        firstName_lastName_birthDate_index: 'firstName1_lastName1_birthDate1',
      },
      '2': {
        id: '2',
        firstName: 'firstName2',
        lastName: 'lastName2',
        birthDate: 'birthDate2',
        firstName_lastName_birthDate_index: 'firstName2_lastName2_birthDate2',
      },
    });
  });
});
