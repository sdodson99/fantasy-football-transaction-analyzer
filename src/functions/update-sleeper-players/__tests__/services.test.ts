import * as services from '../services';

describe('services', () => {
  describe('build', () => {
    it('should provide services', () => {
      const {
        resolveGetAllSleeperApiPlayersQuery,
        resolveSaveAllSleeperPlayersCommand,
      } = services.build();

      expect(resolveGetAllSleeperApiPlayersQuery()).toBeTruthy();
      expect(resolveSaveAllSleeperPlayersCommand()).toBeTruthy();
    });
  });
});
