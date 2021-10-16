import { TransactionTeam, TransactionTeams } from '../transaction-teams';

/**
 * Service to generate a KTC transaction analysis link.
 */
export class KtcTransactionAnalysisLinkGenerator {
  private ktcAnalysisBaseUrl: string;

  /**
   * Initialize.
   */
  constructor() {
    this.ktcAnalysisBaseUrl =
      'https://keeptradecut.com/trade-calculator?var=5&pickVal=0&format=1';
  }

  /**
   * Generate a KTC transaction analysis link.
   * @param transactionTeams The transaction teams to generate an analysis for. Can only analyze max 2 teams.
   * @returns The URL link to the transaction analysis.
   */
  generate(transactionTeams: TransactionTeams): string {
    const team1PlayerParams = this.toTransactionAssetParams(
      transactionTeams.team1
    );
    const team2PlayerParams = this.toTransactionAssetParams(
      transactionTeams.team2
    );

    return `${this.ktcAnalysisBaseUrl}&teamOne=${team1PlayerParams}&teamTwo=${team2PlayerParams}`;
  }

  /**
   * Convert a transaction team to URL team params.
   * @param transactionTeam The team to get params for.
   * @returns The URL params string for the transaction team.
   */
  private toTransactionAssetParams(transactionTeam: TransactionTeam): string {
    const transactionAssetIds = [
      ...transactionTeam.players.map((p) => p.id),
      ...transactionTeam.draftPicks.map((p) => p.id),
    ];

    return transactionAssetIds.join('|');
  }
}
