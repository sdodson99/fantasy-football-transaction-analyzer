import { Player } from '../trade-asset';
import PLAYER_DATA from './data/player-data.json';
import { SleeperPlayer } from './sleeper-player';

export const getSleeperPlayers = (): Player[] => {
  const sleeperPlayersData: SleeperPlayer[] = Object.values(PLAYER_DATA);

  return sleeperPlayersData.map((p) => ({
    id: p.player_id,
    firstName: p.first_name,
    lastName: p.last_name,
  }));
};
