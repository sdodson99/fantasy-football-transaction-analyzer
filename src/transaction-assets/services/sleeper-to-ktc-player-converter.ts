import { KtcPlayer } from '../ktc/ktc-transaction-asset';
import { GetByDetailsKtcPlayerQuery } from '../ktc/queries/get-by-details-ktc-player-query';
import { GetByIdSleeperPlayerQuery } from '../sleeper/queries/get-by-id-sleeper-player-query';

/**
 * Service to convert a Sleeper player to KTC player.
 */
export class SleeperToKtcPlayerConverter {
  /**
   * Initialize with queries.
   * @param getByIdSleeperPlayerQuery The query to get a transaction player by ID.
   * @param getByDetailsKtcPlayerQuery The query to get a KTC player by details.
   */
  constructor(
    private getByIdSleeperPlayerQuery: GetByIdSleeperPlayerQuery,
    private getByDetailsKtcPlayerQuery: GetByDetailsKtcPlayerQuery
  ) {}

  /**
   * Convert a Sleeper player to a KTC player.
   * @param sleeperPlayerId The ID of the Sleeper player to convert.
   * @returns The KTC player result. Null if KTC player not found.
   */
  async convert(sleeperPlayerId: string): Promise<KtcPlayer | null> {
    const sleeperPlayer = await this.getByIdSleeperPlayerQuery.execute(
      sleeperPlayerId
    );

    const { firstName, lastName, birthDate } = sleeperPlayer;

    const ktcPlayer = this.getByDetailsKtcPlayerQuery.execute(
      firstName,
      lastName,
      birthDate ?? ''
    );

    return ktcPlayer;
  }
}
