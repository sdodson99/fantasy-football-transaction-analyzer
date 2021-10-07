export type DraftPick = {
  id: string;
  round: number;
  year: number;
};

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
};

export type TradeAsset = Player | DraftPick;
