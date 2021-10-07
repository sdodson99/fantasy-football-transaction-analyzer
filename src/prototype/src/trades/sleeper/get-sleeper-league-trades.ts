import axios from 'axios';
import { Trade, TradeDraftPick, TradePlayer } from '../trade';
import {
  SleeperTransaction,
  SleeperTransactionDraftPick,
  SleeperTransactionPlayerToRoster,
} from './sleeper-transaction';

const toTradePlayers = (
  transactionPlayerToRoster: SleeperTransactionPlayerToRoster
): TradePlayer[] => {
  const playerIds = Object.keys(transactionPlayerToRoster);

  const tradePlayers: TradePlayer[] = playerIds.map((id) => ({
    playerId: id,
    toRosterId: transactionPlayerToRoster[id].toString(),
  }));

  return tradePlayers;
};

const toTradeDraftPick = (
  transactionDraftPick: SleeperTransactionDraftPick
): TradeDraftPick => {
  return {
    round: transactionDraftPick.round,
    year: Number(transactionDraftPick.season),
    toRosterId: transactionDraftPick.roster_id,
  };
};

const toTrade = (transaction: SleeperTransaction): Trade => {
  return {
    id: transaction.transaction_id,
    players: toTradePlayers(transaction.adds),
    draftPicks: transaction.draft_picks.map((d) => toTradeDraftPick(d)),
  };
};

export const getSleeperLeagueTrades = async (
  leagueId: string,
  week: number
): Promise<Trade[]> => {
  const { data: leagueTransactions } = await axios.get<SleeperTransaction[]>(
    `https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`
  );

  const leagueTradeTransactions = leagueTransactions.filter(
    (t) => t.type === 'trade'
  );

  const leagueTrades = leagueTradeTransactions.map((t) => toTrade(t));

  return leagueTrades;
};
