export type TradePlayer = {
  playerId: string;
  toRosterId: string;
};

export type TradeDraftPick = {
  round: number;
  year: number;
  toRosterId: string;
};

export type Trade = {
  id: string;
  players: TradePlayer[];
  draftPicks: TradeDraftPick[];
};
