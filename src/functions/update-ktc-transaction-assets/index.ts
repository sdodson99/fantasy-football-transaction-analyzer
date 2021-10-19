import * as functions from 'firebase-functions';
import * as services from './services';

export const updateKtcTransactionAssets = functions.storage
  .object()
  .onFinalize(async (file) => {
    functions.logger.info('Detected Firebase Storage file creation.');

    if (file.name !== 'ktc-players.json') {
      return functions.logger.info(
        'Created file was not for KTC players update. Maybe next time...',
        { fileName: file.name }
      );
    }

    functions.logger.info('Starting KTC transaction assets update.');

    const serviceProvider = services.build();

    const getAllKtcStoredTransactionAssetsQuery =
      serviceProvider.resolveGetAllKtcStoredTransactionAssetsQuery();
    const saveAllKtcPlayersCommand =
      serviceProvider.resolveSaveAllKtcPlayersCommand();
    const saveAllKtcDraftPicksCommand =
      serviceProvider.resolveSaveAllKtcDraftPicksCommand();

    try {
      functions.logger.info('Querying all Sleeper transaction assets.');
      const { players, draftPicks } =
        await getAllKtcStoredTransactionAssetsQuery.execute();
      functions.logger.info(
        'Successfully queried all KTC transaction assets.',
        {
          ktcDraftPicksCount: draftPicks.length,
          ktcPlayersCount: players.length,
        }
      );

      functions.logger.info('Saving all KTC players.');
      await saveAllKtcPlayersCommand.execute(players);

      functions.logger.info('Saving all KTC draft picks.');
      await saveAllKtcDraftPicksCommand.execute(draftPicks);

      functions.logger.info('Successfully updated KTC transaction assets.');
    } catch (error) {
      functions.logger.error('Failed to update KTC transaction assets.', {
        error,
      });
    }
  });
