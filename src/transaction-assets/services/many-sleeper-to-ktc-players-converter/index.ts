import { SleeperToKtcPlayerConverter } from '../sleeper-to-ktc-player-converter';
import { SleeperToKtcPlayersMap } from './sleeper-to-ktc-players-map';

/**
 * Service to convert many Sleeper players to KTC players.
 */
export class ManySleeperToKtcPlayersConverter {
  /**
   * Initialize with converter.
   * @param sleeperToKtcPlayerConverter The service to convert a Sleeper player to a KTC player.
   */
  constructor(
    private sleeperToKtcPlayerConverter: SleeperToKtcPlayerConverter
  ) {}

  /**
   * Convert Sleeper players to KTC players.
   * @param sleeperPlayerIds The IDs of the Sleeper players to convert.
   * @returns The map of Sleeper player IDs to KTC players.
   */
  async convert(sleeperPlayerIds: string[]): Promise<SleeperToKtcPlayersMap> {
    const sleeperToKtcPlayerConversions = sleeperPlayerIds.map(async (id) => ({
      [id]: await this.sleeperToKtcPlayerConverter.convert(id),
    }));

    const manySleeperIdToKtcPlayerMaps = await Promise.all(
      sleeperToKtcPlayerConversions
    );

    return manySleeperIdToKtcPlayerMaps.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr,
      }),
      {}
    );
  }
}
