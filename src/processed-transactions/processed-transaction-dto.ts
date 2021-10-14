import { TransactionType } from '../transactions/transaction';

export type ProcessedTransactionDto = {
  transactionId: string;
  type: TransactionType;
  week: number;
  analysisUrl: string;
  processedEpochMillis: number;
};
