import { logger } from '../../core/logger';
import * as services from './services';

export const handleUpdateSleeperPlayers = async () => {
  logger.info('Starting Sleeper players update.');

  try {
    const serviceProvider = services.build();

    const getAllSleeperApiPlayersQuery =
      serviceProvider.resolveGetAllSleeperApiPlayersQuery();
    const saveAllSleeperPlayersCommand =
      serviceProvider.resolveSaveAllSleeperPlayersCommand();

    logger.info('Querying all Sleeper players.');
    const sleeperPlayers = await getAllSleeperApiPlayersQuery.execute();
    logger.info('Successfully queried all Sleeper players.', {
      sleeperPlayersCount: sleeperPlayers.length,
    });

    logger.info('Saving all Sleeper players.');
    await saveAllSleeperPlayersCommand.execute(sleeperPlayers);

    logger.info('Successfully updated Sleeper players.');
  } catch (error) {
    logger.error('Failed to update Sleeper players.', {
      error,
    });
  }
};
