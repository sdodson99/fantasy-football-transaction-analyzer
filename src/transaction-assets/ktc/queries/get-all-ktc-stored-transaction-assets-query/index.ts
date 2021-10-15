import {
  KtcDraftPick,
  KtcPlayer,
  KtcTransactionAssets,
} from '../../ktc-transaction-asset';
import { KtcStoredTransactionAsset } from './ktc-stored-transaction-asset';
import { DateTime } from 'luxon';
import { FirebaseStorageJsonFileReader } from '../../../../core/firebase-storage-json-file-reader';

/**
 * Query to get all KTC stored transaction assets.
 */
export class GetAllKtcStoredTransactionAssetsQuery {
  private fileName: string;

  /**
   * Initialize with a Firebase app.
   * @param firebaseApp The initialized Firebase app.
   */
  constructor(
    private firebaseStorageJsonFileReader: FirebaseStorageJsonFileReader
  ) {
    this.fileName = 'ktc-players.json';
  }

  /**
   * Get all KTC stored transaction assets.
   * @returns The KTC transaction assets.
   */
  async execute(): Promise<KtcTransactionAssets> {
    const ktcTransactionAssets = await this.firebaseStorageJsonFileReader.read<
      KtcStoredTransactionAsset[]
    >(this.fileName);

    return ktcTransactionAssets.reduce<KtcTransactionAssets>(
      (assets, currentAsset) => {
        if (this.isDraftPick(currentAsset)) {
          const draftPick = this.toDraftPick(currentAsset);
          assets.draftPicks.push(draftPick);
        } else {
          const player = this.toPlayer(currentAsset);
          assets.players.push(player);
        }

        return assets;
      },
      {
        players: [],
        draftPicks: [],
      }
    );
  }

  /**
   * Check if a transaction asset is a draft pick.
   * @param asset The transaction asset to check.
   * @returns True/false for is draft pick.
   */
  private isDraftPick(asset: KtcStoredTransactionAsset): boolean {
    return asset.position === 'RDP';
  }

  /**
   * Map a transaction asset to a draft pick.
   * @param asset The transaction asset to map.
   * @returns The mapped KTC draft pick.
   */
  private toDraftPick(asset: KtcStoredTransactionAsset): KtcDraftPick {
    const splitName = asset.playerName.split(' ');

    const year = splitName[0];
    const round = splitName[2][0];

    return {
      id: asset.playerID.toString(),
      year: Number(year),
      round: Number(round),
    };
  }

  /**
   * Map a transaction asset to a player.
   * @param asset The transaction asset to map.
   * @returns The mapped KTC player.
   */
  private toPlayer(asset: KtcStoredTransactionAsset): KtcPlayer {
    const { playerName } = asset;
    const nameSeparatorIndex = asset.playerName.indexOf(' ');

    const firstName = playerName.substring(0, nameSeparatorIndex);
    const lastName = playerName.substr(nameSeparatorIndex + 1);

    const birthDateTime = DateTime.fromSeconds(Number(asset.birthday));
    const birthDate = birthDateTime.toFormat('yyyy-MM-dd');

    return {
      id: asset.playerID.toString(),
      firstName,
      lastName,
      birthDate,
      college: asset.college,
      position: asset.position,
      team: asset.team,
    };
  }
}
