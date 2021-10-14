import {
  Transaction,
  TransactionDraftPick,
  TransactionPlayer,
} from '../../transactions/transaction';
import {
  SleeperTransaction,
  SleeperTransactionDraftPick,
  SleeperTransactionPlayerToRoster,
} from '../sleeper-transaction';
import axios from 'axios';

/**
 * Query for transactions in a Sleeper league.
 */
export class GetSleeperLeagueTransactionsQuery {
  /**
   * Get transactions for a league for a given week.
   * @param leagueId The ID of the league.
   * @param week The week for the transactions.
   * @returns The transactions for the week in the league.
   */
  async execute(leagueId: string, week: number): Promise<Transaction[]> {
    const { data: sleeperTransactions } = await axios.get<SleeperTransaction[]>(
      `https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`
    );

    return sleeperTransactions
      .filter((t) => t.status === 'complete')
      .map((t) => this.toTransaction(t, leagueId));
  }

  /**
   * Map a Sleeper transaction to a normalized transaction.
   * @param transaction The Sleeper transaction.
   * @returns The mapped transaction.
   */
  private toTransaction(
    transaction: SleeperTransaction,
    leagueId: string
  ): Transaction {
    const addedPlayers = this.toTransactionPlayers(transaction.adds);
    const droppedPlayers = this.toTransactionPlayers(transaction.drops);
    const draftPicks = transaction.draft_picks.map((d) =>
      this.toTransactionDraftPick(d)
    );

    return {
      id: transaction.transaction_id,
      type: transaction.type,
      leagueId,
      leagueType: 'sleeper',
      week: transaction.leg,
      createdTimestamp: transaction.created,
      addedPlayers,
      droppedPlayers,
      draftPicks,
    };
  }

  /**
   * Map Sleeper transaction players to normalized transaction players.
   * @param transactionPlayerToRoster The map of players to roster IDs.
   * @returns The mapped transaction players.
   */
  private toTransactionPlayers = (
    transactionPlayerToRoster: SleeperTransactionPlayerToRoster | null
  ): TransactionPlayer[] => {
    if (!transactionPlayerToRoster) {
      return [];
    }

    const playerIds = Object.keys(transactionPlayerToRoster);

    return playerIds.map((id) => ({
      playerId: id,
      rosterId: transactionPlayerToRoster[id].toString(),
    }));
  };

  /**
   * Map Sleeper transaction draft pick to a normalized transaction draft pick.
   * @param transactionDraftPick The Sleeper draft pick.
   * @returns The mapped transaction draft pick.
   */
  private toTransactionDraftPick = (
    transactionDraftPick: SleeperTransactionDraftPick
  ): TransactionDraftPick => {
    return {
      round: transactionDraftPick.round,
      year: Number(transactionDraftPick.season),
      toRosterId: transactionDraftPick.owner_id?.toString(),
      fromRosterId: transactionDraftPick.previous_owner_id?.toString(),
    };
  };
}
