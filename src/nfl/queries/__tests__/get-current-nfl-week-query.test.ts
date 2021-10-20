import axios from 'axios';
import { when } from 'jest-when';
import { GetCurrentNflWeekQuery } from '../get-current-nfl-week-query';

jest.mock('axios');
const mockAxiosGet = axios.get as jest.Mock;

describe('GetCurrentNflWeekQuery', () => {
  let query: GetCurrentNflWeekQuery;

  beforeEach(() => {
    query = new GetCurrentNflWeekQuery();
  });

  it('should return current NFL week', async () => {
    const expected = 5;
    when(mockAxiosGet)
      .calledWith('https://api.sleeper.app/v1/state/nfl')
      .mockReturnValue({ data: { week: expected } });

    const week = await query.execute();

    expect(week).toBe(expected);
  });

  it('should throw error if NFL week not returned', async () => {
    when(mockAxiosGet)
      .calledWith('https://api.sleeper.app/v1/state/nfl')
      .mockReturnValue({ data: {} });

    await expect(async () => await query.execute()).rejects.toThrow();
  });
});
