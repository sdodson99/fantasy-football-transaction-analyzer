import * as functions from 'firebase-functions';
import { firebaseApp } from '../../startup/firebase-app';
import { SaveAllSleeperPlayersCommand } from '../../transaction-assets/sleeper/commands/save-all-sleeper-players-command';
import { GetAllSleeperApiPlayersQuery } from '../../transaction-assets/sleeper/queries/get-all-sleeper-api-players-query';

export const updateSleeperPlayers = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(async () => {
    functions.logger.info('Starting Sleeper players update.');

    try {
      const getAllSleeperApiPlayersQuery = new GetAllSleeperApiPlayersQuery();
      const saveAllSleeperPlayersCommand = new SaveAllSleeperPlayersCommand(
        firebaseApp
      );

      functions.logger.info('Querying all Sleeper players.');
      const sleeperPlayers = await getAllSleeperApiPlayersQuery.execute();
      functions.logger.info('Successfully queried all Sleeper players.', {
        sleeperPlayersCount: sleeperPlayers.length,
      });

      functions.logger.info('Saving all Sleeper players.');
      await saveAllSleeperPlayersCommand.execute(sleeperPlayers);

      functions.logger.info('Successfully updated Sleeper players.');
    } catch (error) {
      functions.logger.error('Failed to update Sleeper players.', {
        error,
      });
    }
  });
