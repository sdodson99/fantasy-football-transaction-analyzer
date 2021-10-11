export type Transaction = {
  id: string;
  type: TransactionType;
  week: number;
  createdTimestamp: number;
  addedPlayers: TransactionPlayer[];
  droppedPlayers: TransactionPlayer[];
  draftPicks: TransactionDraftPick[];
};

export type TransactionType = 'trade' | 'free_agent' | 'waiver';

export type TransactionPlayer = {
  playerId: string;
  rosterId: string;
};

export type TransactionDraftPick = {
  year: number;
  round: number;
  toRosterId: string;
  fromRosterId: string;
};
