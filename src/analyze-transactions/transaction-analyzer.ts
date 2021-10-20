import { GetManyByDetailsKtcDraftPicksQuery } from '../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query';
import { ManySleeperToKtcPlayersConverter } from '../transaction-assets/services/many-sleeper-to-ktc-players-converter';
import { Transaction } from '../transactions/transaction';
import { KtcTransactionAnalysisLinkGenerator } from './services/ktc-transaction-analysis-link-generator';
import { TransactionTeamsFactory } from './transaction-teams/transaction-teams-factory';

/**
 * Service to analyze a transaction.
 */
export class TransactionAnalyzer {
  /**
   * Initialize with services.
   * @param manySleeperToKtcPlayersConverter The service to convert Sleeper players to KTC players.
   * @param getManyByDetailsKtcDraftPicksQuery The query to get many KTC draft picks.
   * @param ktcTransactionAnalysisLinkGenerator The service to generate a KTC analysis link.
   * @param transactionTeamsFactory The factory for extracting transaction teams.
   */
  constructor(
    private manySleeperToKtcPlayersConverter: ManySleeperToKtcPlayersConverter,
    private getManyByDetailsKtcDraftPicksQuery: GetManyByDetailsKtcDraftPicksQuery,
    private ktcTransactionAnalysisLinkGenerator: KtcTransactionAnalysisLinkGenerator,
    private transactionTeamsFactory: TransactionTeamsFactory
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

    const transactionTeams = this.transactionTeamsFactory.create(
      transaction,
      sleeperIdToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    return this.ktcTransactionAnalysisLinkGenerator.generate(transactionTeams);
  }
}
