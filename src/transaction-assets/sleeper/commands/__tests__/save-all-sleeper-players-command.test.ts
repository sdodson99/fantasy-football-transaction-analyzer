import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { SleeperPlayer } from '../../sleeper-player';
import { SaveAllSleeperPlayersCommand } from '../save-all-sleeper-players-command';

describe('SaveAllSleeperPlayersCommand', () => {
  let command: SaveAllSleeperPlayersCommand;

  let mockDatabaseSet: jest.Mock;

  beforeEach(() => {
    mockDatabaseSet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef).calledWith(`/players/sleeper`).mockReturnValue({
      set: mockDatabaseSet,
    });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    command = new SaveAllSleeperPlayersCommand(mockFirebaseApp);
  });

  it('should save players to database', async () => {
    const players: SleeperPlayer[] = [
      {
        id: '1',
      } as SleeperPlayer,
      {
        id: '2',
      } as SleeperPlayer,
    ];

    await command.execute(players);

    expect(mockDatabaseSet).toBeCalledWith({
      '1': { id: '1' },
      '2': { id: '2' },
    });
  });
});
