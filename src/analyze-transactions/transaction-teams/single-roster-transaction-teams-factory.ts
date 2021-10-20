import { SleeperToKtcPlayersMap } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../transactions/transaction';

/**
 * Factory for splitting a single roster transaction into transaction teams.
 */
export class SingleRosterTransactionTeamsFactory {
  /**
   * Split a transaction into two sides.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @returns The split transaction teams.
   */
  create(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap
  ) {
    return {
      team1: {
        players: transaction.addedPlayers
          .map((p) => sleeperToKtcPlayerMap[p.playerId])
          .flatMap((p) => (p ? [p] : [])),
        draftPicks: [],
      },
      team2: {
        players: transaction.droppedPlayers
          .map((p) => sleeperToKtcPlayerMap[p.playerId])
          .flatMap((p) => (p ? [p] : [])),
        draftPicks: [],
      },
    };
  }
}
