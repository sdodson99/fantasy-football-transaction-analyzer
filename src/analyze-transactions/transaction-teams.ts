import { KtcPlayer } from '../transaction-assets/ktc/ktc-transaction-asset';

export type TransactionTeam = KtcPlayer[];

export type TransactionTeams = {
  team1: TransactionTeam;
  team2: TransactionTeam;
};

export type MultiRosterTransactionTeams = {
  [rosterId: string]: TransactionTeam;
};
