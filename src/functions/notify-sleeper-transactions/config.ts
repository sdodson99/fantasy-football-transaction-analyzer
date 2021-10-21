import * as functions from 'firebase-functions';
import { TransactionLeagueType } from '../../transactions/transaction';

export type NotifySleeperTransactionsConfig = {
  LEAGUE_ID: string;
  LEAGUE_TYPE: TransactionLeagueType;
  SLEEPER_BOT_EMAIL: string;
  SLEEPER_BOT_PASSWORD: string;
  BITLY_ACCESS_TOKEN: string;
};

export const loadConfig = (): NotifySleeperTransactionsConfig => {
  const config = functions.config();

  return {
    LEAGUE_ID: config.sleeper_league.id,
    LEAGUE_TYPE: 'sleeper',
    SLEEPER_BOT_EMAIL: config.sleeper_bot.email,
    SLEEPER_BOT_PASSWORD: config.sleeper_bot.password,
    BITLY_ACCESS_TOKEN: config.bitly.access_token,
  };
};
