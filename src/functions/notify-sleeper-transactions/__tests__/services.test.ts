import { NotifySleeperTransactionsConfig } from '../config';
import * as services from '../services';

jest.mock('../../../startup/firebase-app');

describe('services', () => {
  describe('build', () => {
    let config: NotifySleeperTransactionsConfig;

    beforeEach(() => {
      config = {
        LEAGUE_ID: 'LEAGUE_ID',
        LEAGUE_TYPE: 'sleeper',
        SLEEPER_BOT_EMAIL: 'SLEEPER_BOT_EMAIL',
        SLEEPER_BOT_PASSWORD: 'SLEEPER_BOT_PASSWORD',
        BITLY_ACCESS_TOKEN: 'BITLY_ACCESS_TOKEN',
      };
    });

    it('should provide services', () => {
      const {
        resolveCreateProcessedTransactionCommand,
        resolveFilterProcessedTransactions,
        resolveGetCurrentNflWeekQuery,
        resolveGetProcessedTransactionsQuery,
        resolveGetSleeperLeagueTransactionsQuery,
        resolveTransactionAnalyzer,
        resolveTransactionNotifier,
        resolveUrlShortener,
      } = services.build(config);

      expect(resolveCreateProcessedTransactionCommand()).toBeTruthy();
      expect(resolveFilterProcessedTransactions()).toBeTruthy();
      expect(resolveGetCurrentNflWeekQuery()).toBeTruthy();
      expect(resolveGetProcessedTransactionsQuery()).toBeTruthy();
      expect(resolveGetSleeperLeagueTransactionsQuery()).toBeTruthy();
      expect(resolveTransactionAnalyzer()).toBeTruthy();
      expect(resolveTransactionNotifier()).toBeTruthy();
      expect(resolveUrlShortener()).toBeTruthy();
    });
  });
});
