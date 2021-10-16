import * as firebase from 'firebase-admin';
import { KtcDraftPick } from '../ktc-transaction-asset';
import { KtcDraftPicksMapDto } from '../ktc-transaction-asset-dto';

/**
 * Query to get a KTC draft pick by the draft pick's details.
 */
export class GetByDetailsKtcDraftPickQuery {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Get a KTC draft pick by the draft pick details.
   * @param round The round of the draft pick to query.
   * @param year The year of the draft pick to query.
   * @returns The draft pick for the details. Null if draft pick not found.
   */
  async execute(round: number, year: number): Promise<KtcDraftPick | null> {
    const ktcDraftPicksPath = `/transaction_assets/ktc/draft_picks`;

    const ktcDraftPickData = await this.firebaseApp
      .database()
      .ref(ktcDraftPicksPath)
      .orderByChild('round_year_index')
      .equalTo(`${round}_${year}`)
      .limitToFirst(1)
      .get();

    const ktcDraftPicksMapDto: KtcDraftPicksMapDto = ktcDraftPickData.val();

    if (ktcDraftPicksMapDto === null) {
      return null;
    }

    return Object.values(ktcDraftPicksMapDto)[0];
  }
}
