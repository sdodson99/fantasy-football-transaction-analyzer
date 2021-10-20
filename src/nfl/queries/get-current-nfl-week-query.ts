import axios from 'axios';

type NflStateDto = {
  week: number;
};

/**
 * Query to get the current NFL week.
 */
export class GetCurrentNflWeekQuery {
  /**
   * Get the current NFL week.
   * @returns The current NFL week.
   */
  async execute() {
    const { data: nflState } = await axios.get<NflStateDto>(
      'https://api.sleeper.app/v1/state/nfl'
    );

    const week = nflState?.week;

    if (!week) {
      throw new Error('Failed to query current NFL week.');
    }

    return week;
  }
}
