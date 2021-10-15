import * as firebase from 'firebase-admin';
import { SleeperPlayer } from '../sleeper-player';
import { SleeperPlayerDto } from '../sleeper-player-dto';

/**
 * Query to get a Sleeper player by ID.
 */
export class GetByIdSleeperPlayerQuery {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Get a Sleeper player by ID.
   * @param playerId The ID of the player to query.
   * @returns The player for the ID.
   */
  async execute(playerId: string): Promise<SleeperPlayer> {
    const sleeperPlayerPath = `/transaction_assets/sleeper/players/${playerId}`;

    const sleeperPlayerData = await this.firebaseApp
      .database()
      .ref(sleeperPlayerPath)
      .get();

    const sleeperPlayerDto: SleeperPlayerDto = sleeperPlayerData.val();

    return sleeperPlayerDto;
  }
}
