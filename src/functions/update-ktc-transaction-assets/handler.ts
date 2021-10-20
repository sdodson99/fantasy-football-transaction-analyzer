import { logger } from '../../core/logger';
import * as services from './services';

export const handleUpdateKtcTransactionAssets = async () => {
  logger.info('Starting KTC transaction assets update.');

  const serviceProvider = services.build();

  const getAllKtcStoredTransactionAssetsQuery =
    serviceProvider.resolveGetAllKtcStoredTransactionAssetsQuery();
  const saveAllKtcPlayersCommand =
    serviceProvider.resolveSaveAllKtcPlayersCommand();
  const saveAllKtcDraftPicksCommand =
    serviceProvider.resolveSaveAllKtcDraftPicksCommand();

  try {
    logger.info('Querying all Sleeper transaction assets.');
    const { players, draftPicks } =
      await getAllKtcStoredTransactionAssetsQuery.execute();
    logger.info('Successfully queried all KTC transaction assets.', {
      ktcDraftPicksCount: draftPicks.length,
      ktcPlayersCount: players.length,
    });

    logger.info('Saving all KTC players.');
    await saveAllKtcPlayersCommand.execute(players);

    logger.info('Saving all KTC draft picks.');
    await saveAllKtcDraftPicksCommand.execute(draftPicks);

    logger.info('Successfully updated KTC transaction assets.');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error.';

    logger.error('Failed to update KTC transaction assets.', {
      error: errorMessage,
    });
  }
};
