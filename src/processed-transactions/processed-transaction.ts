import { TransactionLeagueType } from '../transactions/transaction';

export type ProcessedTransaction = {
  transactionId: string;
  leagueId: string;
  leagueType: TransactionLeagueType;
  week: number;
  analysisUrl: string;
  processedTimestamp: number;
};
