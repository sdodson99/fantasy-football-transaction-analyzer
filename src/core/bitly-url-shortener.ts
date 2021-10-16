import { BitlyClient } from 'bitly';

/**
 * Service to shorten a URL using Bitly.
 */
export class BitlyUrlShortener {
  private bitlyClient: BitlyClient;

  /**
   * Initialize with settings.
   * @param bitlyAccessToken The Bitly access token.
   */
  constructor(bitlyAccessToken: string) {
    this.bitlyClient = new BitlyClient(bitlyAccessToken);
  }

  /**
   * Shorten a URL using Bitly.
   * @param url The URL to shorten.
   * @returns The shortened URL.
   */
  async shorten(url: string): Promise<string> {
    const { link } = await this.bitlyClient.shorten(url);
    return link;
  }
}
