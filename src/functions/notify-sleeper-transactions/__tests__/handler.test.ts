import * as services from '../services';
import { logger } from '../../../core/logger';
import { handleNotifySleeperTransactions } from '../handler';
import { loadConfig } from '../config';
import {
  Transaction,
  TransactionLeagueType,
} from '../../../transactions/transaction';
import { ProcessedTransaction } from '../../../processed-transactions/processed-transaction';
import { when } from 'jest-when';
import { DateTime } from 'luxon';

jest.mock('../services');
const mockBuildServices = services.build as jest.Mock;

jest.mock('../../../core/logger');
const mockLoggerInfo = logger.info as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;

jest.mock('../config');
const mockLoadConfig = loadConfig as jest.Mock;

jest.mock('luxon');
const dateTimeNowMillis = 111;
(DateTime.now as jest.Mock).mockReturnValue({
  toMillis: () => dateTimeNowMillis,
});

describe('handleNotifySleeperTransactions', () => {
  let mockGetCurrentNflWeekQueryExecute: jest.Mock;
  let mockGetSleeperLeagueTransactionsQueryExecute: jest.Mock;
  let mockGetProcessedTransactionsQueryExecute: jest.Mock;
  let mockFilterProcessedTransactions: jest.Mock;
  let mockTransactionAnalyzerAnalyze: jest.Mock;
  let mockUrlShortenerShorten: jest.Mock;
  let mockTransactionNotifierNotify: jest.Mock;
  let mockCreateProcessedTransactionCommandExecute: jest.Mock;

  let leagueId: string;
  let leagueType: TransactionLeagueType;

  let nflWeek: number;
  let transactions: Transaction[];
  let processedTransactions: ProcessedTransaction[];

  beforeEach(() => {
    mockGetCurrentNflWeekQueryExecute = jest.fn();
    mockGetSleeperLeagueTransactionsQueryExecute = jest.fn();
    mockGetProcessedTransactionsQueryExecute = jest.fn();
    mockFilterProcessedTransactions = jest.fn();
    mockTransactionAnalyzerAnalyze = jest.fn();
    mockUrlShortenerShorten = jest.fn();
    mockTransactionNotifierNotify = jest.fn();
    mockCreateProcessedTransactionCommandExecute = jest.fn();

    mockBuildServices.mockReturnValue({
      resolveGetCurrentNflWeekQuery: () => ({
        execute: mockGetCurrentNflWeekQueryExecute,
      }),
      resolveGetSleeperLeagueTransactionsQuery: () => ({
        execute: mockGetSleeperLeagueTransactionsQueryExecute,
      }),
      resolveGetProcessedTransactionsQuery: () => ({
        execute: mockGetProcessedTransactionsQueryExecute,
      }),
      resolveFilterProcessedTransactions: () => mockFilterProcessedTransactions,
      resolveTransactionAnalyzer: () => ({
        analyze: mockTransactionAnalyzerAnalyze,
      }),
      resolveUrlShortener: () => ({
        shorten: mockUrlShortenerShorten,
      }),
      resolveTransactionNotifier: () => ({
        notify: mockTransactionNotifierNotify,
      }),
      resolveCreateProcessedTransactionCommand: () => ({
        execute: mockCreateProcessedTransactionCommandExecute,
      }),
    });

    leagueId = '123';
    leagueType = 'sleeper';

    mockLoadConfig.mockReturnValue({
      LEAGUE_ID: leagueId,
      LEAGUE_TYPE: leagueType,
    });

    nflWeek = 16;
    transactions = [{} as Transaction];
    processedTransactions = [{} as ProcessedTransaction];

    mockGetCurrentNflWeekQueryExecute.mockReturnValue(nflWeek);
    when(mockGetSleeperLeagueTransactionsQueryExecute)
      .calledWith(leagueId, nflWeek)
      .mockReturnValue(transactions);
    when(mockGetProcessedTransactionsQueryExecute)
      .calledWith(leagueId, leagueType)
      .mockReturnValue(processedTransactions);
  });

  afterEach(() => {
    mockBuildServices.mockReset();
    mockLoadConfig.mockReset();
    mockLoggerInfo.mockReset();
    mockLoggerError.mockReset();
  });

  it('should cancel early if no transactions to process', async () => {
    when(mockFilterProcessedTransactions)
      .calledWith(transactions, processedTransactions)
      .mockReturnValue([]);

    await handleNotifySleeperTransactions();

    console.log(mockLoggerInfo.mock.calls);

    expect(mockLoggerInfo).toBeCalledWith('No transactions to process.', {
      unprocessedTransactionsCount: 0,
    });
  });

  describe('with transactions to process', () => {
    let unprocessedTransactions: Transaction[];

    beforeEach(() => {
      unprocessedTransactions = [
        {
          id: '1',
          type: 'trade',
        } as Transaction,
        {
          id: '2',
          type: 'free_agent',
        } as Transaction,
      ];

      when(mockFilterProcessedTransactions)
        .calledWith(transactions, processedTransactions)
        .mockReturnValue(unprocessedTransactions);

      mockTransactionAnalyzerAnalyze.mockImplementation(
        (t) => `${t.id}_analysis`
      );

      mockUrlShortenerShorten.mockImplementation((u) => `${u}_short`);
    });

    it('should process and complete transactions that have not been processed', async () => {
      await handleNotifySleeperTransactions();

      expect(mockCreateProcessedTransactionCommandExecute).toBeCalledWith(
        leagueId,
        leagueType,
        {
          transactionId: '1',
          analysisUrl: '1_analysis',
          leagueId,
          leagueType,
          type: 'trade',
          processedEpochMillis: 111,
        }
      );
      expect(mockCreateProcessedTransactionCommandExecute).toBeCalledWith(
        leagueId,
        leagueType,
        {
          transactionId: '2',
          analysisUrl: '2_analysis',
          leagueId,
          leagueType,
          type: 'free_agent',
          processedEpochMillis: 111,
        }
      );
    });

    it('should notify league of unprocessed trade transactions', async () => {
      await handleNotifySleeperTransactions();

      expect(mockTransactionNotifierNotify).toBeCalledWith(leagueId, {
        transactionId: '1',
        analysisUrl: '1_analysis_short',
        leagueId,
        leagueType,
        processedEpochMillis: 111,
        type: 'trade',
      });
    });
  });

  it('should log error message when unsuccessful', async () => {
    mockGetCurrentNflWeekQueryExecute.mockImplementation(() => {
      throw new Error('Good error message.');
    });

    await handleNotifySleeperTransactions();

    expect(mockLoggerError).toBeCalledWith(expect.any(String), {
      error: 'Good error message.',
      leagueId: '123',
    });
  });
});
