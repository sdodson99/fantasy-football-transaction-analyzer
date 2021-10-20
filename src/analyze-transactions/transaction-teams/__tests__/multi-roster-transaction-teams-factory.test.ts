import { KtcPlayer } from '../../../transaction-assets/ktc/ktc-transaction-asset';
import { DetailsToKtcDraftPickMap } from '../../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query/details-to-ktc-draft-pick-map';
import { SleeperToKtcPlayersMap } from '../../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../../transactions/transaction';
import { MultiRosterTransactionTeamsFactory } from '../multi-roster-transaction-teams-factory';

describe('MultiRosterTransactionTeamsFactory', () => {
  let factory: MultiRosterTransactionTeamsFactory;

  let sleeperToKtcPlayerMap: SleeperToKtcPlayersMap;
  let detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap;
  let transaction: Transaction;

  beforeEach(() => {
    factory = new MultiRosterTransactionTeamsFactory();

    sleeperToKtcPlayerMap = {
      '1': {
        id: 1,
      } as unknown as KtcPlayer,
      '2': {
        id: 2,
      } as unknown as KtcPlayer,
      '3': {
        id: 3,
      } as unknown as KtcPlayer,
    };
    detailsToKtcDraftPicksMap = new DetailsToKtcDraftPickMap();
    detailsToKtcDraftPicksMap.add({
      id: '4',
      round: 1,
      year: 2021,
    });
    detailsToKtcDraftPicksMap.add({
      id: '5',
      round: 3,
      year: 2022,
    });
    transaction = {
      addedPlayers: [
        {
          playerId: '1',
          rosterId: '1',
        },
        {
          playerId: '2',
          rosterId: '1',
        },
        {
          playerId: '3',
          rosterId: '2',
        },
      ],
      droppedPlayers: [
        {
          playerId: '1',
          rosterId: '2',
        },
        {
          playerId: '2',
          rosterId: '2',
        },
        {
          playerId: '3',
          rosterId: '1',
        },
      ],
      draftPicks: [
        {
          fromRosterId: '1',
          toRosterId: '2',
          round: 3,
          year: 2022,
        },
      ],
    } as Transaction;
  });

  it('should return correct teams for transaction', () => {
    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: 1 }, { id: 2 }], draftPicks: [] },
      team2: {
        players: [{ id: 3 }],
        draftPicks: [{ id: '5', round: 3, year: 2022 }],
      },
    });
  });

  it('should return correct teams for transaction without draft picks', () => {
    transaction.draftPicks = [];

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: 1 }, { id: 2 }], draftPicks: [] },
      team2: { players: [{ id: 3 }], draftPicks: [] },
    });
  });

  it('should return correct teams for empty transaction', () => {
    transaction.addedPlayers = [];
    transaction.droppedPlayers = [];
    transaction.draftPicks = [];

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [], draftPicks: [] },
      team2: { players: [], draftPicks: [] },
    });
  });

  it('should return correct teams when only draft picks', () => {
    transaction.addedPlayers = [];
    transaction.droppedPlayers = [];

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [], draftPicks: [{ id: '5', round: 3, year: 2022 }] },
      team2: { players: [], draftPicks: [] },
    });
  });

  it('should return correct teams when player is missing', () => {
    transaction.addedPlayers.push({
      playerId: '123',
      rosterId: '1',
    });

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: 1 }, { id: 2 }], draftPicks: [] },
      team2: {
        players: [{ id: 3 }],
        draftPicks: [{ id: '5', round: 3, year: 2022 }],
      },
    });
  });

  it('should return correct teams when draft pick is missing', () => {
    transaction.draftPicks.push({
      fromRosterId: '1',
      toRosterId: '2',
      year: 5000,
      round: 123,
    });

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: 1 }, { id: 2 }], draftPicks: [] },
      team2: {
        players: [{ id: 3 }],
        draftPicks: [{ id: '5', round: 3, year: 2022 }],
      },
    });
  });
});
