import { GetByDetailsKtcDraftPickQuery } from '../get-by-details-ktc-draft-pick-query';
import { DetailsToKtcDraftPickMap } from './details-to-ktc-draft-pick-map';
import { DraftPickDetails } from './draft-pick-details';

/**
 * Query to get many KTC draft picks by details.
 */
export class GetManyByDetailsKtcDraftPicksQuery {
  /**
   * Initialize with query.
   * @param getByDetailsKtcDraftPickQuery Query for getting KTC draft pick by details.
   */
  constructor(
    private getByDetailsKtcDraftPickQuery: GetByDetailsKtcDraftPickQuery
  ) {}

  /**
   * Get many KTC draft picks by many details.
   * @param draftPicksDetails The many draft pick details to query for.
   * @returns The map of KTC details to draft picks.
   */
  async execute(
    draftPicksDetails: DraftPickDetails[]
  ): Promise<DetailsToKtcDraftPickMap> {
    const draftPickQueries = draftPicksDetails.map(({ round, year }) =>
      this.getByDetailsKtcDraftPickQuery.execute(round, year)
    );

    const draftPicks = await Promise.all(draftPickQueries);

    const detailsToDraftPickMap = new DetailsToKtcDraftPickMap();

    draftPicks.forEach((draftPick) => {
      if (!draftPick) {
        return;
      }

      detailsToDraftPickMap.add(draftPick);
    });

    return detailsToDraftPickMap;
  }
}
