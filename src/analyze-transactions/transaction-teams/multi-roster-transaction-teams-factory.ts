import { DetailsToKtcDraftPickMap } from '../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query/details-to-ktc-draft-pick-map';
import { SleeperToKtcPlayersMap } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../transactions/transaction';
import { TransactionTeam } from './transaction-teams';

type MultiRosterTransactionTeams = {
  [rosterId: string]: TransactionTeam;
};

/**
 * Factory for splitting a multi roster transaction into transaction teams.
 */
export class MultiRosterTransactionTeamsFactory {
  /**
   * Split a multi roster transaction into two teams.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @param detailsToKtcDraftPicksMap The map of draft pick details to KTC draft picks.
   * @returns The split transaction teams.
   */
  create(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap,
    detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap
  ) {
    let multiRosterTransactionTeams =
      transaction.addedPlayers.reduce<MultiRosterTransactionTeams>(
        (result, curr) => {
          const { playerId, rosterId } = curr;

          if (!result[rosterId]) {
            result[rosterId] = {
              players: [],
              draftPicks: [],
            };
          }

          const player = sleeperToKtcPlayerMap[playerId];

          if (!player) {
            return result;
          }

          result[rosterId].players.push(player);

          return result;
        },
        {}
      );

    multiRosterTransactionTeams = transaction.draftPicks.reduce(
      (result, curr) => {
        const { round, year, toRosterId: rosterId } = curr;

        if (!result[rosterId]) {
          result[rosterId] = {
            players: [],
            draftPicks: [],
          };
        }

        const draftPick = detailsToKtcDraftPicksMap.get({
          round: round,
          year: year,
        });

        if (!draftPick) {
          return result;
        }

        result[rosterId].draftPicks.push(draftPick);

        return result;
      },
      multiRosterTransactionTeams
    );

    const rosterTransactionTeams = Object.values(multiRosterTransactionTeams);

    return {
      team1:
        rosterTransactionTeams.length > 0
          ? rosterTransactionTeams[0]
          : { players: [], draftPicks: [] },
      team2:
        rosterTransactionTeams.length > 1
          ? rosterTransactionTeams[1]
          : { players: [], draftPicks: [] },
    };
  }
}
