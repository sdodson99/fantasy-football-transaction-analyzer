export type Transaction = {
  id: string;
  leagueType: TransactionLeagueType;
  leagueId: string;
  type: TransactionType;
  week: number;
  addedPlayers: TransactionPlayer[];
  droppedPlayers: TransactionPlayer[];
  draftPicks: TransactionDraftPick[];
  createdTimestamp: number;
};

export type TransactionType = 'trade' | 'free_agent' | 'waiver';

export type TransactionLeagueType = 'sleeper';

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
