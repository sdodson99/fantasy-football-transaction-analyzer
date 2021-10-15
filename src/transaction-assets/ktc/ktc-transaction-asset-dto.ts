/* eslint-disable camelcase */
import { KtcPlayer } from './ktc-transaction-asset';

export type KtcPlayerDto = KtcPlayer & {
  firstName_lastName_birthDate_index: string;
};

export type KtcPlayersMapDto = {
  [playerId: string]: KtcPlayerDto;
};
