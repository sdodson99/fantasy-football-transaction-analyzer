import { getKeepTradeCutAssets } from '../get-keep-trade-cut-assets';

jest.mock('../data/player-data.json', () => [
  {
    id: 1,
    name: 'Lamar Jackson',
    age: 25,
  },
  {
    id: 2,
    name: 'Justin Tucker',
    age: 22,
  },
  {
    id: 3,
    name: '2022 Early 1st',
    age: -1,
  },
]);

describe('getKeepTradeCutAssets', () => {
  it('should map Keep Trade Cut players to trade assets', () => {
    const expected = [
      { id: '1', firstName: 'Lamar', lastName: 'Jackson' },
      { id: '2', firstName: 'Justin', lastName: 'Tucker' },
      { id: '3', year: 2022, round: 1 },
    ];

    const tradeAssets = getKeepTradeCutAssets();

    expect(tradeAssets).toEqual(expected);
  });
});
