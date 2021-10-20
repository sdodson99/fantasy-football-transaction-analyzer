import * as functions from 'firebase-functions';
import { handleNotifySleeperTransactions } from './handler';

export const notifySleeperTransactions = functions
  .runWith({
    memory: '512MB',
    timeoutSeconds: 300,
  })
  .pubsub.schedule('0 * * * *')
  .onRun(handleNotifySleeperTransactions);
