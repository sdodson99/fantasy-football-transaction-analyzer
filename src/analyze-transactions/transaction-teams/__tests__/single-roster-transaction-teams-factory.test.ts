import { KtcPlayer } from '../../../transaction-assets/ktc/ktc-transaction-asset';
import { SleeperToKtcPlayersMap } from '../../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../../transactions/transaction';
import { SingleRosterTransactionTeamsFactory } from '../single-roster-transaction-teams-factory';

describe('SingleRosterTransactionTeamsFactory', () => {
  let factory: SingleRosterTransactionTeamsFactory;

  let sleeperToKtcPlayerMap: SleeperToKtcPlayersMap;
  let transaction: Transaction;

  beforeEach(() => {
    factory = new SingleRosterTransactionTeamsFactory();

    sleeperToKtcPlayerMap = {
      '1': {
        id: '1',
      } as KtcPlayer,

      '2': {
        id: '2',
      } as KtcPlayer,

      '3': {
        id: '3',
      } as KtcPlayer,
    };

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
      ],
      droppedPlayers: [
        {
          playerId: '3',
          rosterId: '1',
        },
      ],
    } as Transaction;
  });

  it('should return correct transaction teams for transaction', () => {
    const transactionTeams = factory.create(transaction, sleeperToKtcPlayerMap);

    console.log(JSON.stringify(transactionTeams));

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: '1' }, { id: '2' }], draftPicks: [] },
      team2: { players: [{ id: '3' }], draftPicks: [] },
    });
  });

  it('should return correct transaction teams when player not found', () => {
    transaction.addedPlayers.push({
      playerId: '111111',
      rosterId: '1',
    });

    const transactionTeams = factory.create(transaction, sleeperToKtcPlayerMap);

    expect(transactionTeams).toEqual({
      team1: { players: [{ id: '1' }, { id: '2' }], draftPicks: [] },
      team2: { players: [{ id: '3' }], draftPicks: [] },
    });
  });

  it('should return correct transaction teams when transaction empty', () => {
    transaction.addedPlayers = [];
    transaction.droppedPlayers = [];

    const transactionTeams = factory.create(transaction, sleeperToKtcPlayerMap);

    expect(transactionTeams).toEqual({
      team1: { players: [], draftPicks: [] },
      team2: { players: [], draftPicks: [] },
    });
  });
});
