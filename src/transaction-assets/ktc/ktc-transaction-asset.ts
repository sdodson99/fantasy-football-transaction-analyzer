export type KtcPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  college: string;
  team: string;
  position: string;
};

export type KtcDraftPick = {
  id: string;
  round: number;
  year: number;
};

export type KtcTransactionAssets = {
  players: KtcPlayer[];
  draftPicks: KtcDraftPick[];
};
