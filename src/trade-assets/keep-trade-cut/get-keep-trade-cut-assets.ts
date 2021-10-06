import { DraftPick, Player, TradeAsset } from '../trade-asset';
import {
  KeepTradeCutPlayer,
} from './keep-trade-cut-player';
import PLAYER_DATA from './data/player-data.json'

const toPlayer = (player: KeepTradeCutPlayer): Player => {
  const splitName = player.name.split(' ');

  const firstName = splitName[0];
  const lastName = splitName[1];

  return {
    id: player.id.toString(),
    firstName,
    lastName,
  };
};

const toDraftPick = (player: KeepTradeCutPlayer): DraftPick => {
  const splitName = player.name.split(' ');

  const year = splitName[0];
  const round = splitName[2][0];

  return {
    id: player.id.toString(),
    year: Number(year),
    round: Number(round),
  };
};

const toTradeAsset = (player: KeepTradeCutPlayer): TradeAsset => {
  const isDraftPick = player.age === -1;

  if (isDraftPick) {
    return toDraftPick(player);
  }

  return toPlayer(player);
};

export const getKeepTradeCutAssets = (): TradeAsset[] => {
  return PLAYER_DATA.map((p) => toTradeAsset(p));
};
