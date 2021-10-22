import { getFirebaseApp } from '../../startup/firebase-app';
import { SaveAllSleeperPlayersCommand } from '../../transaction-assets/sleeper/commands/save-all-sleeper-players-command';
import { GetAllSleeperApiPlayersQuery } from '../../transaction-assets/sleeper/queries/get-all-sleeper-api-players-query';

export const build = () => {
  const firebaseApp = getFirebaseApp();

  const getAllSleeperApiPlayersQuery = new GetAllSleeperApiPlayersQuery();
  const saveAllSleeperPlayersCommand = new SaveAllSleeperPlayersCommand(
    firebaseApp
  );

  return {
    resolveGetAllSleeperApiPlayersQuery: () => getAllSleeperApiPlayersQuery,
    resolveSaveAllSleeperPlayersCommand: () => saveAllSleeperPlayersCommand,
  };
};
