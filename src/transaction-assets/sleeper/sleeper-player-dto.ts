import { SleeperPlayer } from './sleeper-player';

export type SleeperPlayerDto = SleeperPlayer;

export type SleeperPlayersMapDto = {
  [playerId: string]: SleeperPlayerDto;
};
