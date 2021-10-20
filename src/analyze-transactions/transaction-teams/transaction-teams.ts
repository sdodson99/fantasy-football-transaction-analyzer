import {
  KtcDraftPick,
  KtcPlayer,
} from '../../transaction-assets/ktc/ktc-transaction-asset';

export type TransactionTeam = {
  players: KtcPlayer[];
  draftPicks: KtcDraftPick[];
};

export type TransactionTeams = {
  team1: TransactionTeam;
  team2: TransactionTeam;
};
