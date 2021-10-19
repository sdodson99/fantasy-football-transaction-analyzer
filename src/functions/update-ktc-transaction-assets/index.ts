import * as functions from 'firebase-functions';
import { logger } from '../../core/logger';
import * as services from './services';

export const updateKtcTransactionAssets = functions.storage
  .object()
  .onFinalize(async (file) => {
    logger.info('Detected Firebase Storage file creation.');

    if (file.name !== 'ktc-players.json') {
      return logger.info(
        'Created file was not for KTC players update. Maybe next time...',
        { fileName: file.name }
      );
    }

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
      logger.error('Failed to update KTC transaction assets.', {
        error,
      });
    }
  });
