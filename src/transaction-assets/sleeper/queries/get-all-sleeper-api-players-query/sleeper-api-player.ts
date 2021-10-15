/* eslint-disable camelcase */
export type SleeperApiPlayer = {
  player_id: string;
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  college?: string | null;
  team: string | null;
  position: string | null;
};

export type SleeperApiPlayersResponse = {
  [playerId: string]: SleeperApiPlayer;
};
