import { ManySleeperToKtcPlayersConverter } from '..';
import { SleeperToKtcPlayerConverter } from '../../sleeper-to-ktc-player-converter';

describe('ManySleeperToKtcPlayersConverter', () => {
  let converter: ManySleeperToKtcPlayersConverter;

  let mockSingleConvert: jest.Mock;

  beforeEach(() => {
    mockSingleConvert = jest.fn();
    const mockSleeperToKtcPlayerConverter = {
      convert: mockSingleConvert,
    } as unknown as SleeperToKtcPlayerConverter;

    converter = new ManySleeperToKtcPlayersConverter(
      mockSleeperToKtcPlayerConverter
    );
  });

  it('should return Sleeper to KTC player map', async () => {
    mockSingleConvert.mockImplementation((id) => ({ id }));

    const map = await converter.convert(['1', '2']);

    expect(map).toEqual({
      '1': {
        id: '1',
      },
      '2': {
        id: '2',
      },
    });
  });
});
