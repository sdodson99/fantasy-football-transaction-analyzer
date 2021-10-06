import { getKeepTradeCutAssets } from './trade-assets/keep-trade-cut/get-keep-trade-cut-assets';
import { getSleeperPlayers } from './trade-assets/sleeper/get-sleeper-players';

const keepTradeCutAssets = getKeepTradeCutAssets();

console.log(keepTradeCutAssets);

const sleeperPlayers = getSleeperPlayers();

console.log(sleeperPlayers);
