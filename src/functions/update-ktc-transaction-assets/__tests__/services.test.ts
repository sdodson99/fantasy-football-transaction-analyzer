import * as services from '../services';

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
