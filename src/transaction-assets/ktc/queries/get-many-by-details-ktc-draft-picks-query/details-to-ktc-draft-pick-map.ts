import { KtcDraftPick } from '../../ktc-transaction-asset';
import { DraftPickDetails } from './draft-pick-details';

/**
 * Model mapping draft pick details to KTC draft picks.
 */
export class DetailsToKtcDraftPickMap {
  private map: Record<string, KtcDraftPick>;

  /**
   * Initialize.
   */
  constructor() {
    this.map = {};
  }

  /**
   * Get a draft pick by details.
   * @param details The details of the draft pick to get.
   * @returns The draft pick for the details. Null if not found.
   */
  get(details: DraftPickDetails): KtcDraftPick | null {
    const key = this.toKey(details);

    return this.map[key] ?? null;
  }

  /**
   * Add a draft pick to the map.
   * @param draftPick The draft pick to add.
   */
  add(draftPick: KtcDraftPick) {
    const key = this.toKey({
      round: draftPick.round,
      year: draftPick.year,
    });

    this.map[key] = { ...draftPick };
  }

  /**
   * Create a unique key for draft pick details.
   * @param details The draft pick details to create a key for.
   * @returns The created key.
   */
  private toKey(details: DraftPickDetails): string {
    return `${details.round}_${details.year}`;
  }
}
