import * as functions from 'firebase-functions';

const leagueId = functions.config().league.id;

export const watchLeagueTransactions = functions.pubsub
  .schedule('every 30 minutes')
  .onRun((context) => {
    console.log(leagueId);
  });
