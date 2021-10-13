/* eslint-disable camelcase */
export type SleeperTransactionType = 'trade' | 'free_agent' | 'waiver';

export type SleeperTransactionDraftPick = {
  round: number;
  season: string;
  owner_id: number;
  previous_owner_id: number;
};

export type SleeperTransactionPlayerToRoster = {
  [player_id: string]: number;
};

export type SleeperTransaction = {
  transaction_id: string;
  type: SleeperTransactionType;
  leg: number;
  created: number;
  adds: SleeperTransactionPlayerToRoster | null;
  drops: SleeperTransactionPlayerToRoster | null;
  draft_picks: SleeperTransactionDraftPick[];
};
