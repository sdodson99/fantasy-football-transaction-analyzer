import * as functions from 'firebase-functions';
import * as services from './services';

export const updateSleeperPlayers = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(async () => {
    functions.logger.info('Starting Sleeper players update.');

    try {
      const serviceProvider = services.build();

      const getAllSleeperApiPlayersQuery =
        serviceProvider.resolveGetAllSleeperApiPlayersQuery();
      const saveAllSleeperPlayersCommand =
        serviceProvider.resolveSaveAllSleeperPlayersCommand();

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
