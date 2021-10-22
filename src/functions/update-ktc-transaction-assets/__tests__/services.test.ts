import * as services from '../services';

jest.mock('../../../startup/firebase-app');

describe('services', () => {
  describe('build', () => {
    it('should provide services', () => {
      const {
        resolveGetAllKtcStoredTransactionAssetsQuery,
        resolveSaveAllKtcPlayersCommand,
        resolveSaveAllKtcDraftPicksCommand,
      } = services.build();

      expect(resolveGetAllKtcStoredTransactionAssetsQuery()).toBeTruthy();
      expect(resolveSaveAllKtcPlayersCommand()).toBeTruthy();
      expect(resolveSaveAllKtcDraftPicksCommand()).toBeTruthy();
    });
  });
});
