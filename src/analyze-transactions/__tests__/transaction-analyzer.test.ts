import { when } from 'jest-when';
import { GetManyByDetailsKtcDraftPicksQuery } from '../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query';
import { ManySleeperToKtcPlayersConverter } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter';
import { Transaction } from '../../transactions/transaction';
import { KtcTransactionAnalysisLinkGenerator } from '../services/ktc-transaction-analysis-link-generator';
import { TransactionAnalyzer } from '../transaction-analyzer';
import { TransactionTeamsFactory } from '../transaction-teams/transaction-teams-factory';

describe('TransactionAnalyzer', () => {
  let analyzer: TransactionAnalyzer;

  let mockManySleeperToKtcPlayersConverterConvert: jest.Mock;
  let mockGetManyByDetailsKtcDraftPicksQueryExecute: jest.Mock;
  let mockKtcTransactionAnalysisLinkGeneratorGenerate: jest.Mock;
  let mockTransactionTeamsFactoryCreate: jest.Mock;

  let transaction: Transaction;

  beforeEach(() => {
    mockManySleeperToKtcPlayersConverterConvert = jest.fn();
    const manySleeperToKtcPlayersConverter = {
      convert: mockManySleeperToKtcPlayersConverterConvert,
    } as unknown as ManySleeperToKtcPlayersConverter;

    mockGetManyByDetailsKtcDraftPicksQueryExecute = jest.fn();
    const getManyByDetailsKtcDraftPicksQuery = {
      execute: mockGetManyByDetailsKtcDraftPicksQueryExecute,
    } as unknown as GetManyByDetailsKtcDraftPicksQuery;

    mockKtcTransactionAnalysisLinkGeneratorGenerate = jest.fn();
    const ktcTransactionAnalysisLinkGenerator = {
      generate: mockKtcTransactionAnalysisLinkGeneratorGenerate,
    } as unknown as KtcTransactionAnalysisLinkGenerator;

    mockTransactionTeamsFactoryCreate = jest.fn();
    const transactionTeamsFactory = {
      create: mockTransactionTeamsFactoryCreate,
    } as unknown as TransactionTeamsFactory;

    analyzer = new TransactionAnalyzer(
      manySleeperToKtcPlayersConverter,
      getManyByDetailsKtcDraftPicksQuery,
      ktcTransactionAnalysisLinkGenerator,
      transactionTeamsFactory
    );

    transaction = {
      addedPlayers: [
        { playerId: '1', rosterId: '1' },
        { playerId: '2', rosterId: '1' },
      ],
      droppedPlayers: [
        { playerId: '3', rosterId: '1' },
        { playerId: '4', rosterId: '1' },
      ],
      draftPicks: [
        {
          fromRosterId: '1',
          toRosterId: '2',
          year: 2022,
          round: 1,
        },
      ],
    } as Transaction;
  });

  it('should return analysis link for transaction', async () => {
    const sleeperIdToKtcPlayerMap = {};
    when(mockManySleeperToKtcPlayersConverterConvert)
      .calledWith(['1', '2', '3', '4'])
      .mockReturnValue(sleeperIdToKtcPlayerMap);
    const detailsToKtcDraftPicksMap = {};
    when(mockGetManyByDetailsKtcDraftPicksQueryExecute)
      .calledWith(transaction.draftPicks)
      .mockReturnValue(detailsToKtcDraftPicksMap);
    const transactionTeams = {};
    when(mockTransactionTeamsFactoryCreate)
      .calledWith(
        transaction,
        sleeperIdToKtcPlayerMap,
        detailsToKtcDraftPicksMap
      )
      .mockReturnValue(transactionTeams);
    when(mockKtcTransactionAnalysisLinkGeneratorGenerate)
      .calledWith(transactionTeams)
      .mockReturnValue('link');

    const analysisLink = await analyzer.analyze(transaction);

    expect(analysisLink).toBe('link');
  });
});
