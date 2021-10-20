import * as functions from 'firebase-functions';
import { TransactionLeagueType } from '../../transactions/transaction';

const LEAGUE_ID = functions.config().sleeper_league.id;
const SLEEPER_BOT_EMAIL = functions.config().sleeper_bot.email;
const SLEEPER_BOT_PASSWORD = functions.config().sleeper_bot.password;
const BITLY_ACCESS_TOKEN = functions.config().bitly.access_token;
const LEAGUE_TYPE: TransactionLeagueType = 'sleeper';

export const Config = {
  LEAGUE_ID,
  SLEEPER_BOT_EMAIL,
  SLEEPER_BOT_PASSWORD,
  BITLY_ACCESS_TOKEN,
  LEAGUE_TYPE,
};

export type NotifySleeperTransactionsConfig = typeof Config;
