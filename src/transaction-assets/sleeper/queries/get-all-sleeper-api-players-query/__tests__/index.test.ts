import axios from 'axios';
import { when } from 'jest-when';
import { GetAllSleeperApiPlayersQuery } from '..';

jest.mock('axios');
const mockAxiosGet = axios.get as jest.Mock;

describe('GetAllSleeperApiPlayersQuery', () => {
  let query: GetAllSleeperApiPlayersQuery;

  beforeEach(() => {
    query = new GetAllSleeperApiPlayersQuery();
  });

  afterEach(() => {
    mockAxiosGet.mockReset();
  });

  it('should return mapped Sleeper players', async () => {
    const mockApiResponse = {
      '123': {
        player_id: 'player_id',
        first_name: 'first_name',
        last_name: 'last_name',
        birth_date: 'birth_date',
        college: 'college',
        team: 'team',
        position: 'position',
      },
      '456': {
        player_id: 'player_id',
        first_name: 'first_name',
        last_name: 'last_name',
      },
    };
    when(mockAxiosGet)
      .calledWith(`https://api.sleeper.app/v1/players/nfl`)
      .mockReturnValue({ data: mockApiResponse });

    const result = await query.execute();

    expect(result).toEqual([
      {
        id: 'player_id',
        firstName: 'first_name',
        lastName: 'last_name',
        birthDate: 'birth_date',
        college: 'college',
        position: 'position',
        team: 'team',
      },
      {
        id: 'player_id',
        firstName: 'first_name',
        lastName: 'last_name',
        college: null,
        birthDate: null,
        position: null,
        team: null,
      },
    ]);
  });
});
