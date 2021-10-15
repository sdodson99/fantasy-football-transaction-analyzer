/* eslint-disable camelcase */
import { KtcDraftPick, KtcPlayer } from './ktc-transaction-asset';

export type KtcPlayerDto = KtcPlayer & {
  firstName_lastName_birthDate_index: string;
};

export type KtcPlayersMapDto = {
  [playerId: string]: KtcPlayerDto;
};

export type KtcDraftPickDto = KtcDraftPick & {
  round_year_index: string;
};

export type KtcDraftPicksMapDto = {
  [draftPickId: string]: KtcDraftPickDto;
};
