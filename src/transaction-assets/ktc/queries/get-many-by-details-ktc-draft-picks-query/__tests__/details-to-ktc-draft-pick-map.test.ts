import { DetailsToKtcDraftPickMap } from '../details-to-ktc-draft-pick-map';

describe('DetailsToKtcDraftPickMap', () => {
  let map: DetailsToKtcDraftPickMap;

  beforeEach(() => {
    map = new DetailsToKtcDraftPickMap();

    map.add({
      id: '1',
      round: 1,
      year: 2020,
    });
    map.add({
      id: '2',
      round: 2,
      year: 2020,
    });
  });

  it('should return draft pick for details if draft pick exists', () => {
    const draftPick = map.get({
      round: 1,
      year: 2020,
    });

    expect(draftPick).toEqual({ id: '1', round: 1, year: 2020 });
  });

  it('should return null if draft pick does not exist', () => {
    const draftPick = map.get({
      round: 3,
      year: 2020,
    });

    expect(draftPick).toBeNull();
  });
});
