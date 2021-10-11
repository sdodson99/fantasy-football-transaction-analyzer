/* eslint-disable camelcase */
import SleeperPlayerData from '../raw-data/sleeper-player-data.json';

type RawSleeperPlayer = {
  player_id: string;
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  college?: string | null;
  team: string | null;
  position: string | null;
};

type SleeperPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  college: string | null;
  team: string | null;
  position: string | null;
};

const toPlayer = (player: RawSleeperPlayer): SleeperPlayer => {
  return {
    id: player.player_id,
    firstName: player.first_name,
    lastName: player.last_name,
    birthDate: player.birth_date ?? null,
    college: player.college ?? null,
    position: player.position,
    team: player.team,
  };
};

export const mapSleeperPlayers = (): Array<SleeperPlayer> => {
  const sleeperPlayerDataListing: Array<RawSleeperPlayer> =
    Object.values(SleeperPlayerData);

  return sleeperPlayerDataListing.map((p) => toPlayer(p));
};
