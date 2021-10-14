import {
  TransactionLeagueType,
  TransactionType,
} from '../transactions/transaction';

export type ProcessedTransaction = {
  transactionId: string;
  type: TransactionType;
  leagueId: string;
  leagueType: TransactionLeagueType;
  week: number;
  analysisUrl: string;
  processedEpochMillis: number;
};
