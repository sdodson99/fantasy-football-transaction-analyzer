import { GetManyByDetailsKtcDraftPicksQuery } from '../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query';
import { DetailsToKtcDraftPickMap } from '../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query/details-to-ktc-draft-pick-map';
import { ManySleeperToKtcPlayersConverter } from '../transaction-assets/services/many-sleeper-to-ktc-players-converter';
import { SleeperToKtcPlayersMap } from '../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../transactions/transaction';
import { KtcTransactionAnalysisLinkGenerator } from './services/ktc-transaction-analysis-link-generator';
import {
  MultiRosterTransactionTeams,
  TransactionTeams,
} from './transaction-teams';

/**
 * Service to analyze a transaction.
 * TODO: Need to refactor the TransactionTeams conversion logic!
 */
export class TransactionAnalyzer {
  /**
   * Initialize with services.
   * @param manySleeperToKtcPlayersConverter The service to convert Sleeper players to KTC players.
   * @param getManyByDetailsKtcDraftPicksQuery The query to get many KTC draft picks.
   * @param ktcTransactionAnalysisLinkGenerator The service to generate a KTC analysis link.
   */
  constructor(
    private manySleeperToKtcPlayersConverter: ManySleeperToKtcPlayersConverter,
    private getManyByDetailsKtcDraftPicksQuery: GetManyByDetailsKtcDraftPicksQuery,
    private ktcTransactionAnalysisLinkGenerator: KtcTransactionAnalysisLinkGenerator
  ) {}

  /**
   * Analyze a transaction.
   * @param transaction The transaction to analyze.
   * @returns The transaction analysis link.
   */
  async analyze(transaction: Transaction): Promise<string> {
    const transactionPlayerIds = [
      ...transaction.addedPlayers.map((p) => p.playerId),
      ...transaction.droppedPlayers.map((p) => p.playerId),
    ];

    const sleeperIdToKtcPlayerMap =
      await this.manySleeperToKtcPlayersConverter.convert(transactionPlayerIds);

    const detailsToKtcDraftPicksMap =
      await this.getManyByDetailsKtcDraftPicksQuery.execute(
        transaction.draftPicks
      );

    const transactionTeams = this.getTransactionTeams(
      transaction,
      sleeperIdToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    return this.ktcTransactionAnalysisLinkGenerator.generate(transactionTeams);
  }

  /**
   * Get the teams for each side of the transaction.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @param detailsToKtcDraftPicksMap The map of draft pick details to KTC draft picks.
   * @returns The teams for each side of the transaction.
   */
  getTransactionTeams(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap,
    detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap
  ): TransactionTeams {
    if (transaction.type === 'trade') {
      return this.getMultiRosterTransactionTeams(
        transaction,
        sleeperToKtcPlayerMap,
        detailsToKtcDraftPicksMap
      );
    }

    return this.getSingleRosterTransactionTeams(
      transaction,
      sleeperToKtcPlayerMap
    );
  }

  /**
   * Get the teams for each side of the single roster transaction.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @returns The teams for each side of the single roster transaction.
   */
  getSingleRosterTransactionTeams(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap
  ): TransactionTeams {
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

  /**
   * Get the teams for each side of the multi-roster transaction.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @param detailsToKtcDraftPicksMap The map of draft pick details to KTC draft picks.
   * @returns The teams for all sides of the multi-roster transaction.
   */
  getMultiRosterTransactionTeams(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap,
    detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap
  ): TransactionTeams {
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
