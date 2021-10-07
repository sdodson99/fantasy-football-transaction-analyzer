/* eslint-disable camelcase */
export type SleeperTransactionType = 'trade' | 'free_agent' | 'waiver';

export type SleeperTransactionDraftPick = {
  round: number;
  season: string;
  roster_id: string;
};

export type SleeperTransactionPlayerToRoster = {
  [player_id: string]: number;
};

export type SleeperTransaction = {
  transaction_id: string;
  type: SleeperTransactionType;
  draft_picks: SleeperTransactionDraftPick[];
  adds: SleeperTransactionPlayerToRoster;
};
