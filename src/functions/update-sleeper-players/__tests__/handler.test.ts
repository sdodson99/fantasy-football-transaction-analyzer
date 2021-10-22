import * as services from '../services';
import { logger } from '../../../core/logger';
import { handleUpdateSleeperPlayers } from '../handler';

jest.mock('../services');
const mockBuildServices = services.build as jest.Mock;

jest.mock('../../../core/logger');
const mockLoggerError = logger.error as jest.Mock;

describe('handleUpdateSleeperPlayers', () => {
  let mockGetAllSleeperApiPlayersQueryExecute: jest.Mock;
  let mockSaveAllSleeperPlayersCommandExecute: jest.Mock;

  beforeEach(() => {
    mockGetAllSleeperApiPlayersQueryExecute = jest.fn();
    const mockGetAllSleeperApiPlayersQuery = {
      execute: mockGetAllSleeperApiPlayersQueryExecute,
    };

    mockSaveAllSleeperPlayersCommandExecute = jest.fn();
    const mockSaveAllSleeperPlayersCommand = {
      execute: mockSaveAllSleeperPlayersCommandExecute,
    };

    mockBuildServices.mockReturnValue({
      resolveGetAllSleeperApiPlayersQuery: () =>
        mockGetAllSleeperApiPlayersQuery,
      resolveSaveAllSleeperPlayersCommand: () =>
        mockSaveAllSleeperPlayersCommand,
    });
  });

  afterEach(() => {
    mockBuildServices.mockReset();
  });

  it('should save updated Sleeper players when successful', async () => {
    const mockSleeperPlayers = [{}, {}, {}];
    mockGetAllSleeperApiPlayersQueryExecute.mockReturnValue(mockSleeperPlayers);

    await handleUpdateSleeperPlayers();

    expect(mockSaveAllSleeperPlayersCommandExecute).toBeCalledWith(
      mockSleeperPlayers
    );
  });

  it('should log error message when unsuccessful', async () => {
    mockGetAllSleeperApiPlayersQueryExecute.mockImplementation(() => {
      throw new Error('Good error message.');
    });

    await handleUpdateSleeperPlayers();

    expect(mockLoggerError).toBeCalledWith(expect.any(String), {
      error: 'Good error message.',
    });
  });
});
