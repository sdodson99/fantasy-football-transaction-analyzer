import * as firebase from 'firebase-admin';
import { KtcDraftPick } from '../ktc-transaction-asset';
import { KtcDraftPicksMapDto } from '../ktc-transaction-asset-dto';

/**
 * Command to save all KTC draft picks.
 */
export class SaveAllKtcDraftPicksCommand {
  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(private firebaseApp: firebase.app.App) {}

  /**
   * Save all KTC draft picks.
   * @param ktcDraftPicks The draft picks to save.
   */
  async execute(ktcDraftPicks: KtcDraftPick[]): Promise<void> {
    const ktcDraftPicksPath = '/transaction_assets/ktc/draft_picks';

    const ktcDraftPicksMap: KtcDraftPicksMapDto =
      ktcDraftPicks.reduce<KtcDraftPicksMapDto>(
        (prev, curr) => ({
          ...prev,
          [curr.id]: {
            ...curr,
            round_year_index: `${curr.round}_${curr.year}`,
          },
        }),
        {}
      );

    await this.firebaseApp
      .database()
      .ref(ktcDraftPicksPath)
      .set(ktcDraftPicksMap);
  }
}
