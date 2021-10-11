import * as functions from 'firebase-functions';

const sleeperLeagueId = functions.config().sleeperLeague.id;

export const watchSleeperTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun((context) => {
    console.log(sleeperLeagueId);
  });
