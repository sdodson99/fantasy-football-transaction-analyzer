import { when } from 'jest-when';
import { GetByDetailsKtcPlayerQuery } from '../../ktc/queries/get-by-details-ktc-player-query';
import { GetByIdSleeperPlayerQuery } from '../../sleeper/queries/get-by-id-sleeper-player-query';
import { SleeperToKtcPlayerConverter } from '../sleeper-to-ktc-player-converter';

describe('SleeperToKtcPlayerConverter', () => {
  let converter: SleeperToKtcPlayerConverter;

  let mockGetByIdExecute: jest.Mock;
  let mockGetByDetailsExecute: jest.Mock;

  let sleeperPlayerID: string;
  let firstName: string;
  let lastName: string;
  let birthDate: string;

  beforeEach(() => {
    mockGetByIdExecute = jest.fn();
    const mockGetByIdSleeperPlayerQuery = {
      execute: mockGetByIdExecute,
    } as unknown as GetByIdSleeperPlayerQuery;

    mockGetByDetailsExecute = jest.fn();
    const mockGetByDetailsKtcPlayerQuery = {
      execute: mockGetByDetailsExecute,
    } as unknown as GetByDetailsKtcPlayerQuery;

    converter = new SleeperToKtcPlayerConverter(
      mockGetByIdSleeperPlayerQuery,
      mockGetByDetailsKtcPlayerQuery
    );

    sleeperPlayerID = '1';
    firstName = 'firstName';
    lastName = 'lastName';
    birthDate = 'birthDate';
  });

  it('should return KTC player for Sleeper player details', async () => {
    const ktcPlayer = {
      id: '1',
    };
    when(mockGetByIdExecute).calledWith(sleeperPlayerID).mockReturnValue({
      firstName,
      lastName,
      birthDate,
    });
    when(mockGetByDetailsExecute)
      .calledWith(firstName, lastName, birthDate)
      .mockReturnValue(ktcPlayer);

    const result = await converter.convert(sleeperPlayerID);

    expect(result).toBe(ktcPlayer);
  });

  it('should return null if KTC player not found', async () => {
    when(mockGetByIdExecute).calledWith(sleeperPlayerID).mockReturnValue({
      firstName,
      lastName,
      birthDate: null,
    });
    when(mockGetByDetailsExecute)
      .calledWith(firstName, lastName, '')
      .mockReturnValue(null);

    const result = await converter.convert(sleeperPlayerID);

    expect(result).toBeNull();
  });
});
