import { FirebaseStorageJsonFileReader } from '../../core/firebase-storage-json-file-reader';
import { getFirebaseApp } from '../../startup/firebase-app';
import { SaveAllKtcDraftPicksCommand } from '../../transaction-assets/ktc/commands/save-all-ktc-draft-picks-command';
import { SaveAllKtcPlayersCommand } from '../../transaction-assets/ktc/commands/save-all-ktc-players-command';
import { GetAllKtcStoredTransactionAssetsQuery } from '../../transaction-assets/ktc/queries/get-all-ktc-stored-transaction-assets-query';

export const build = () => {
  const firebaseApp = getFirebaseApp();

  const firebaseStorageJsonFileReader = new FirebaseStorageJsonFileReader(
    firebaseApp
  );

  const getAllKtcStoredTransactionAssetsQuery =
    new GetAllKtcStoredTransactionAssetsQuery(firebaseStorageJsonFileReader);
  const saveAllKtcPlayersCommand = new SaveAllKtcPlayersCommand(firebaseApp);
  const saveAllKtcDraftPicksCommand = new SaveAllKtcDraftPicksCommand(
    firebaseApp
  );

  return {
    resolveGetAllKtcStoredTransactionAssetsQuery: () =>
      getAllKtcStoredTransactionAssetsQuery,
    resolveSaveAllKtcPlayersCommand: () => saveAllKtcPlayersCommand,
    resolveSaveAllKtcDraftPicksCommand: () => saveAllKtcDraftPicksCommand,
  };
};
