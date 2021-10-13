import { GetSleeperLeagueTransactionsQuery } from '../get-sleeper-league-transactions-query';
import axios from 'axios';
import { when } from 'jest-when';
import { SleeperTransaction } from '../../sleeper-transaction';

jest.mock('axios');
const mockAxiosGet = axios.get as jest.Mock;

describe('GetSleeperLeagueTransactionsQuery', () => {
  let query: GetSleeperLeagueTransactionsQuery;

  let leagueId: string;
  let week: number;
  let transactionsApiUrl: string;

  beforeEach(() => {
    query = new GetSleeperLeagueTransactionsQuery();

    leagueId = '123';
    week = 4;
    transactionsApiUrl = 'https://api.sleeper.app/v1/league/123/transactions/4';
  });

  afterEach(() => {
    mockAxiosGet.mockReset();
  });

  it('should return mapped league transactions for week', async () => {
    const mockSleeperTransasctions: SleeperTransaction[] = [
      {
        transaction_id: '1',
        type: 'trade',
        leg: 4,
        created: 1,
        adds: {
          '1': 3,
          '2': 1,
        },
        drops: {
          '2': 3,
          '1': 1,
        },
        draft_picks: [
          {
            season: '2022',
            round: 3,
            previous_owner_id: 1,
            owner_id: 4,
          },
        ],
      },
      {
        transaction_id: '2',
        type: 'free_agent',
        leg: 4,
        created: 1,
        adds: {
          '3': 3,
        },
        drops: null,
        draft_picks: [],
      },
    ];
    when(mockAxiosGet)
      .calledWith(transactionsApiUrl)
      .mockReturnValue({ data: mockSleeperTransasctions });

    const result = await query.execute(leagueId, week);

    expect(result).toEqual([
      {
        id: '1',
        type: 'trade',
        leagueId: '123',
        leagueType: 'sleeper',
        week: 4,
        createdTimestamp: 1,
        addedPlayers: [
          { playerId: '1', rosterId: '3' },
          { playerId: '2', rosterId: '1' },
        ],
        droppedPlayers: [
          { playerId: '1', rosterId: '1' },
          { playerId: '2', rosterId: '3' },
        ],
        draftPicks: [
          {
            round: 3,
            year: 2022,
            fromRosterId: '1',
            toRosterId: '4',
          },
        ],
      },
      {
        id: '2',
        type: 'free_agent',
        leagueId: '123',
        leagueType: 'sleeper',
        week: 4,
        createdTimestamp: 1,
        addedPlayers: [{ playerId: '3', rosterId: '3' }],
        droppedPlayers: [],
        draftPicks: [],
      },
    ]);
  });

  it('should return empty array when league has no transactions for week', async () => {
    when(mockAxiosGet)
      .calledWith(transactionsApiUrl)
      .mockReturnValue({ data: [] });

    const result = await query.execute(leagueId, week);

    expect(result).toEqual([]);
  });

  it('should return empty added players when transaction has no added players', async () => {
    const mockSleeperTransasctions: SleeperTransaction[] = [
      {
        transaction_id: '1',
        type: 'free_agent',
        leg: 4,
        created: 1,
        adds: null,
        drops: {
          '3': 3,
        },
        draft_picks: [],
      },
    ];
    when(mockAxiosGet)
      .calledWith(transactionsApiUrl)
      .mockReturnValue({ data: mockSleeperTransasctions });

    const result = await query.execute(leagueId, week);

    expect(result[0].addedPlayers).toEqual([]);
  });

  it('should return empty dropped players when transaction has no dropped players', async () => {
    const mockSleeperTransasctions: SleeperTransaction[] = [
      {
        transaction_id: '1',
        type: 'free_agent',
        leg: 4,
        created: 1,
        adds: {
          '3': 3,
        },
        drops: null,
        draft_picks: [],
      },
    ];
    when(mockAxiosGet)
      .calledWith(transactionsApiUrl)
      .mockReturnValue({ data: mockSleeperTransasctions });

    const result = await query.execute(leagueId, week);

    expect(result[0].droppedPlayers).toEqual([]);
  });
});
