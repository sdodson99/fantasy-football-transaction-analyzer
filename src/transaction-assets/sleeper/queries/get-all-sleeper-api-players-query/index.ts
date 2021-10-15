import axios from 'axios';
import { SleeperPlayer } from '../../sleeper-player';
import {
  SleeperApiPlayer,
  SleeperApiPlayersResponse,
} from './sleeper-api-player';

/**
 * Query for all Sleeper NFL players from the Sleeper API.
 */
export class GetAllSleeperApiPlayersQuery {
  /**
   * Get all Sleeper NFL players from the Sleeper API.
   * @returns The array of all NFL players.
   */
  async execute(): Promise<SleeperPlayer[]> {
    const { data: playersResponse } =
      await axios.get<SleeperApiPlayersResponse>(
        `https://api.sleeper.app/v1/players/nfl`
      );

    const players = Object.values(playersResponse);

    return players.map((p) => this.toPlayer(p));
  }

  /**
   * Map a Sleeper API player to a Sleeper player.
   * @param player The API player to map.
   * @returns The mapped player.
   */
  private toPlayer(player: SleeperApiPlayer): SleeperPlayer {
    return {
      id: player.player_id,
      firstName: player.first_name,
      lastName: player.last_name,
      birthDate: player.birth_date ?? null,
      college: player.college ?? null,
      position: player.position ?? null,
      team: player.team ?? null,
    };
  }
}
