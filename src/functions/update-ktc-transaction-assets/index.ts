import * as functions from 'firebase-functions';
import { logger } from '../../core/logger';
import { handleUpdateKtcTransactionAssets } from './handler';

export const updateKtcTransactionAssets = functions.storage
  .object()
  .onFinalize(async (file) => {
    logger.info('Detected Firebase Storage file creation.');

    const fileName = file.name;
    if (fileName !== 'ktc-players.json') {
      return logger.info(
        'Created file was not for KTC players update. Maybe next time...',
        { fileName }
      );
    }

    await handleUpdateKtcTransactionAssets();
  });
