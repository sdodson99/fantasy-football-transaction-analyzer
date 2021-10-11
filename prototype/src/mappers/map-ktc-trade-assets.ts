import KtcPlayerData from '../raw-data/ktc-player-data.json';
import { DateTime } from 'luxon';

type RawKtcPlayer = {
  playerID: number;
  playerName: string;
  birthday: string;
  college: string;
  team: string;
  position: string;
};

type KtcPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  college: string;
  team: string;
  position: string;
};

type KtcDraftPick = {
  id: string;
  round: number;
  year: number;
};

type KtcTradeAsset = KtcPlayer | KtcDraftPick;

const toPlayer = (player: RawKtcPlayer): KtcPlayer => {
  const { playerName } = player;
  const nameSeparatorIndex = player.playerName.indexOf(' ');

  const firstName = playerName.substring(0, nameSeparatorIndex);
  const lastName = playerName.substr(nameSeparatorIndex + 1);

  const birthDateTime = DateTime.fromSeconds(Number(player.birthday));
  const birthDate = birthDateTime.toFormat('yyyy-MM-dd');

  return {
    id: player.playerID.toString(),
    firstName,
    lastName,
    birthDate,
    college: player.college,
    position: player.position,
    team: player.team,
  };
};

const toDraftPick = (player: RawKtcPlayer): KtcDraftPick => {
  const splitName = player.playerName.split(' ');

  const year = splitName[0];
  const round = splitName[2][0];

  return {
    id: player.playerID.toString(),
    year: Number(year),
    round: Number(round),
  };
};

const toTradeAsset = (player: RawKtcPlayer): KtcTradeAsset => {
  const isDraftPick = player.position === 'RDP';

  if (isDraftPick) {
    return toDraftPick(player);
  }

  return toPlayer(player);
};

export const mapKtcTradeAssets = (): Array<KtcTradeAsset> => {
  const ktcPlayerDataListing = KtcPlayerData as Array<RawKtcPlayer>;

  return ktcPlayerDataListing.map((p) => toTradeAsset(p));
};
