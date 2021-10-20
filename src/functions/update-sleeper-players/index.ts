import * as functions from 'firebase-functions';
import { handleUpdateSleeperPlayers } from './handler';

export const updateSleeperPlayers = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(handleUpdateSleeperPlayers);
