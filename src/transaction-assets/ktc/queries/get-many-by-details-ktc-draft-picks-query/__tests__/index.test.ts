import { GetManyByDetailsKtcDraftPicksQuery } from '..';
import { GetByDetailsKtcDraftPickQuery } from '../../get-by-details-ktc-draft-pick-query';

describe('GetManyByDetailsKtcDraftPicksQuery', () => {
  let query: GetManyByDetailsKtcDraftPicksQuery;

  let mockSingleQueryExecute: jest.Mock;

  beforeEach(() => {
    mockSingleQueryExecute = jest.fn();
    const mockGetByDetailsKtcDraftPickQuery = {
      execute: mockSingleQueryExecute,
    } as unknown as GetByDetailsKtcDraftPickQuery;

    query = new GetManyByDetailsKtcDraftPicksQuery(
      mockGetByDetailsKtcDraftPickQuery
    );
  });

  it('should return map for draft pick details to KTC draft picks', async () => {
    mockSingleQueryExecute.mockImplementation((round, year) => ({
      id: `${round}${year}`,
      round,
      year,
    }));

    const map = await query.execute([
      {
        round: 1,
        year: 2020,
      },
      {
        round: 2,
        year: 2020,
      },
    ]);

    expect(map.get({ round: 1, year: 2020 })).toEqual({
      id: `12020`,
      round: 1,
      year: 2020,
    });
    expect(map.get({ round: 10, year: 100 })).toBeNull();
  });

  it('should not return null draft picks in map', async () => {
    mockSingleQueryExecute.mockReturnValue(null);

    const map = await query.execute([
      {
        round: 1,
        year: 2020,
      },
      {
        round: 2,
        year: 2020,
      },
    ]);

    expect(map.get({ round: 1, year: 2020 })).toBeNull();
  });
});
