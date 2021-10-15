import * as firebase from 'firebase-admin';
import { SleeperPlayer } from '../sleeper-player';
import { SleeperPlayersMapDto } from '../sleeper-player-dto';

/**
 * Command to save all Sleeper players.
 */
export class SaveAllSleeperPlayersCommand {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Save all Sleeper players.
   * @param sleeperPlayers The players to save.
   */
  async execute(sleeperPlayers: SleeperPlayer[]): Promise<void> {
    const sleeperPlayersPath = '/transaction_assets/sleeper/players';

    const sleeperPlayersMap: SleeperPlayersMapDto =
      sleeperPlayers.reduce<SleeperPlayersMapDto>(
        (prev, curr) => ({
          ...prev,
          [curr.id]: curr,
        }),
        {}
      );

    await this.firebaseApp
      .database()
      .ref(sleeperPlayersPath)
      .set(sleeperPlayersMap);
  }
}
