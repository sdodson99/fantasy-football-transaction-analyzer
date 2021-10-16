import { KtcPlayer } from '../../ktc/ktc-transaction-asset';

export type SleeperToKtcPlayersMap = {
  [sleeperPlayerId: string]: KtcPlayer | null;
};
