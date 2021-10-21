import * as functions from 'firebase-functions';
import { loadConfig } from '../config';

jest.mock('firebase-functions');
const mockFunctionsConfig = functions.config as unknown as jest.Mock;

describe('config', () => {
  describe('loadConfig', () => {
    afterEach(() => {
      mockFunctionsConfig.mockReset();
    });

    it('should return config values from Firebase Functions config', () => {
      mockFunctionsConfig.mockReturnValue({
        sleeper_league: {
          id: 'league_id',
        },
        sleeper_bot: {
          email: 'sleeper_bot_email',
          password: 'sleeper_bot_password',
        },
        bitly: {
          access_token: 'bitly_access_token',
        },
      });

      const config = loadConfig();

      expect(config).toEqual({
        BITLY_ACCESS_TOKEN: 'bitly_access_token',
        LEAGUE_ID: 'league_id',
        LEAGUE_TYPE: 'sleeper',
        SLEEPER_BOT_EMAIL: 'sleeper_bot_email',
        SLEEPER_BOT_PASSWORD: 'sleeper_bot_password',
      });
    });
  });
});
