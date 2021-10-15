import * as firebase from 'firebase-admin';
import { KtcPlayer } from '../ktc-transaction-asset';
import { KtcPlayersMapDto } from '../ktc-transaction-asset-dto';

/**
 * Query to get a KTC player by the player's details.
 */
export class GetByDetailsKtcPlayerQuery {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Get a Ktc player by the player details.
   * @param firstName The first name of the player to query.
   * @param lastName The last name of the player to query.
   * @param birthDate The birth date (yyyy-mm-dd) of the player to query.
   * @returns The player for the details. Null if player not found.
   */
  async execute(
    firstName: string,
    lastName: string,
    birthDate: string
  ): Promise<KtcPlayer | null> {
    const ktcPlayersPath = `/transaction_assets/ktc/players`;

    const ktcPlayerData = await this.firebaseApp
      .database()
      .ref(ktcPlayersPath)
      .orderByChild('firstName_lastName_birthDate_index')
      .equalTo(`${firstName}_${lastName}_${birthDate}`)
      .limitToFirst(1)
      .get();

    const ktcPlayersMapDto: KtcPlayersMapDto = ktcPlayerData.val();

    if (ktcPlayersMapDto === null) {
      return null;
    }

    return Object.values(ktcPlayersMapDto)[0];
  }
}
