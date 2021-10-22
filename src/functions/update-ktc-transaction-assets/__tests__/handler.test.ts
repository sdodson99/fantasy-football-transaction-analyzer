import * as services from '../services';
import { logger } from '../../../core/logger';
import { handleUpdateKtcTransactionAssets } from '../handler';

jest.mock('../services');
const mockBuildServices = services.build as jest.Mock;

jest.mock('../../../core/logger');
const mockLoggerError = logger.error as jest.Mock;

describe('handleUpdateKtcTransactionAssets', () => {
  let mockGetAllKtcStoredTransactionAssetsQueryExecute: jest.Mock;
  let mockSaveAllKtcPlayersCommandExecute: jest.Mock;
  let mockSaveAllKtcDraftPicksCommandExecute: jest.Mock;

  beforeEach(() => {
    mockGetAllKtcStoredTransactionAssetsQueryExecute = jest.fn();
    const mockGetAllKtcStoredTransactionAssetsQuery = {
      execute: mockGetAllKtcStoredTransactionAssetsQueryExecute,
    };

    mockSaveAllKtcPlayersCommandExecute = jest.fn();
    const mockSaveAllKtcPlayersCommand = {
      execute: mockSaveAllKtcPlayersCommandExecute,
    };

    mockSaveAllKtcDraftPicksCommandExecute = jest.fn();
    const mockSaveAllKtcDraftPicksCommand = {
      execute: mockSaveAllKtcDraftPicksCommandExecute,
    };

    mockBuildServices.mockReturnValue({
      resolveGetAllKtcStoredTransactionAssetsQuery: () =>
        mockGetAllKtcStoredTransactionAssetsQuery,
      resolveSaveAllKtcPlayersCommand: () => mockSaveAllKtcPlayersCommand,
      resolveSaveAllKtcDraftPicksCommand: () => mockSaveAllKtcDraftPicksCommand,
    });
  });

  afterEach(() => {
    mockBuildServices.mockReset();
  });

  it('should save updated KTC players when successful', async () => {
    const mockKtcPlayers = [{}, {}, {}];
    mockGetAllKtcStoredTransactionAssetsQueryExecute.mockReturnValue({
      players: mockKtcPlayers,
      draftPicks: [],
    });

    await handleUpdateKtcTransactionAssets();

    expect(mockSaveAllKtcPlayersCommandExecute).toBeCalledWith(mockKtcPlayers);
  });

  it('should save updated KTC draft picks when successful', async () => {
    const mockKtcDraftPicks = [{}, {}, {}];
    mockGetAllKtcStoredTransactionAssetsQueryExecute.mockReturnValue({
      players: [],
      draftPicks: mockKtcDraftPicks,
    });

    await handleUpdateKtcTransactionAssets();

    expect(mockSaveAllKtcDraftPicksCommandExecute).toBeCalledWith(
      mockKtcDraftPicks
    );
  });

  it('should log error message when unsuccessful', async () => {
    mockGetAllKtcStoredTransactionAssetsQueryExecute.mockImplementation(() => {
      throw new Error('Good error message.');
    });

    await handleUpdateKtcTransactionAssets();

    expect(mockLoggerError).toBeCalledWith(expect.any(String), {
      error: 'Good error message.',
    });
  });
});
