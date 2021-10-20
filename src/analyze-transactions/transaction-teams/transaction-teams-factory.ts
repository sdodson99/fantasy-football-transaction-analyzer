import { DetailsToKtcDraftPickMap } from '../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query/details-to-ktc-draft-pick-map';
import { SleeperToKtcPlayersMap } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../transactions/transaction';
import { MultiRosterTransactionTeamsFactory } from './multi-roster-transaction-teams-factory';
import { SingleRosterTransactionTeamsFactory } from './single-roster-transaction-teams-factory';
import { TransactionTeams } from './transaction-teams';

/**
 * Factory for splitting a transaction into transaction teams.
 */
export class TransactionTeamsFactory {
  /**
   * Initialize with transaction team factories.
   * @param singleRosterTransactionTeamsFactory Transaction team factory for single roster transaction, such as a waiver.
   * @param multiRosterTransactionTeamsFactory Transaction team factory for multi roster transaction, such as a trade.
   */
  constructor(
    private singleRosterTransactionTeamsFactory: SingleRosterTransactionTeamsFactory,
    private multiRosterTransactionTeamsFactory: MultiRosterTransactionTeamsFactory
  ) {}

  /**
   * Split a transaction into two teams.
   * @param transaction The transaction to extract teams from.
   * @param sleeperToKtcPlayerMap The map of Sleeper players to KTC players.
   * @param detailsToKtcDraftPicksMap The map of draft pick details to KTC draft picks.
   * @returns The split transaction teams.
   */
  create(
    transaction: Transaction,
    sleeperToKtcPlayerMap: SleeperToKtcPlayersMap,
    detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap
  ): TransactionTeams {
    if (transaction.type === 'trade') {
      return this.multiRosterTransactionTeamsFactory.create(
        transaction,
        sleeperToKtcPlayerMap,
        detailsToKtcDraftPicksMap
      );
    }

    return this.singleRosterTransactionTeamsFactory.create(
      transaction,
      sleeperToKtcPlayerMap
    );
  }
}
