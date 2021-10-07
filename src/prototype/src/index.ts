// import { getKeepTradeCutAssets } from './trade-assets/keep-trade-cut/get-keep-trade-cut-assets';
// import { getSleeperPlayers } from './trade-assets/sleeper/get-sleeper-players';

import { getSleeperLeagueTrades } from './trades/sleeper/get-sleeper-league-trades';

// const keepTradeCutAssets = getKeepTradeCutAssets();

// console.log(keepTradeCutAssets);

// const sleeperPlayers = getSleeperPlayers();

// console.log(sleeperPlayers);

const leagueId = '724028750487961600';
const week = 4;

(async () => {
  const trades = await getSleeperLeagueTrades(leagueId, week);

  trades.forEach((t) => {
    console.log(t);
  });
})();
