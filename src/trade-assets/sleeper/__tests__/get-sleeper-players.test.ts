import { getSleeperPlayers } from '../get-sleeper-players';

jest.mock('../data/player-data.json', () => ({
  '1': {
    player_id: '1',
    first_name: 'Lamar',
    last_name: 'Jackson',
  },
  '2': {
    player_id: '2',
    first_name: 'Justin',
    last_name: 'Tucker',
  },
}));

describe('getSleeperPlayers', () => {
  it('should map Sleepers players to players', () => {
    const expected = [
      { id: '1', firstName: 'Lamar', lastName: 'Jackson' },
      { id: '2', firstName: 'Justin', lastName: 'Tucker' },
    ];

    const players = getSleeperPlayers();

    expect(players).toEqual(expected);
  });
});
