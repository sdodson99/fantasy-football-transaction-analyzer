import * as firebase from 'firebase-admin';
import { KtcPlayer } from '../ktc-transaction-asset';
import { KtcPlayersMapDto } from '../ktc-transaction-asset-dto';

/**
 * Command to save all KTC players.
 */
export class SaveAllKtcPlayersCommand {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Save all KTC players.
   * @param ktcPlayers The players to save.
   */
  async execute(ktcPlayers: KtcPlayer[]): Promise<void> {
    const ktcPlayersPath = '/transaction_assets/ktc/players';

    const ktcPlayersMap: KtcPlayersMapDto = ktcPlayers.reduce<KtcPlayersMapDto>(
      (prev, curr) => ({
        ...prev,
        [curr.id]: {
          ...curr,
          firstName_lastName_birthDate_index: `${curr.firstName}_${curr.lastName}_${curr.birthDate}`,
        },
      }),
      {}
    );

    await this.firebaseApp.database().ref(ktcPlayersPath).set(ktcPlayersMap);
  }
}
