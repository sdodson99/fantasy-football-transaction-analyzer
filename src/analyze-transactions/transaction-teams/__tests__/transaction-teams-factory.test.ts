import { when } from 'jest-when';
import { DetailsToKtcDraftPickMap } from '../../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query/details-to-ktc-draft-pick-map';
import { SleeperToKtcPlayersMap } from '../../../transaction-assets/services/many-sleeper-to-ktc-players-converter/sleeper-to-ktc-players-map';
import { Transaction } from '../../../transactions/transaction';
import { TransactionTeamsFactory } from '../transaction-teams-factory';

describe('TransactionTeamsFactory', () => {
  let factory: TransactionTeamsFactory;

  let mockSingleRosterTransactionTeamsFactoryCreate: jest.Mock;
  let mockMultiRosterTransactionTeamsFactoryCreate: jest.Mock;

  let sleeperToKtcPlayerMap: SleeperToKtcPlayersMap;
  let detailsToKtcDraftPicksMap: DetailsToKtcDraftPickMap;
  let transaction: Transaction;

  beforeEach(() => {
    mockSingleRosterTransactionTeamsFactoryCreate = jest.fn();
    const singleRosterTransactionTeamsFactory = {
      create: mockSingleRosterTransactionTeamsFactoryCreate,
    };

    mockMultiRosterTransactionTeamsFactoryCreate = jest.fn();
    const multiRosterTransactionTeamsFactory = {
      create: mockMultiRosterTransactionTeamsFactoryCreate,
    };

    factory = new TransactionTeamsFactory(
      singleRosterTransactionTeamsFactory,
      multiRosterTransactionTeamsFactory
    );

    transaction = {} as Transaction;
    sleeperToKtcPlayerMap = {} as SleeperToKtcPlayersMap;
    detailsToKtcDraftPicksMap = {} as DetailsToKtcDraftPickMap;
  });

  it('should return multi roster transaction teams if transaction is trade', () => {
    transaction.type = 'trade';
    const multiRosterTransactionTeams = {};
    when(mockMultiRosterTransactionTeamsFactoryCreate)
      .calledWith(transaction, sleeperToKtcPlayerMap, detailsToKtcDraftPicksMap)
      .mockReturnValue(multiRosterTransactionTeams);

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toBe(multiRosterTransactionTeams);
  });

  it('should return single roster transaction teams if transaction is not a trade', () => {
    transaction.type = 'free_agent';
    const singleRosterTransactionTeams = {};
    when(mockSingleRosterTransactionTeamsFactoryCreate)
      .calledWith(transaction, sleeperToKtcPlayerMap)
      .mockReturnValue(singleRosterTransactionTeams);

    const transactionTeams = factory.create(
      transaction,
      sleeperToKtcPlayerMap,
      detailsToKtcDraftPicksMap
    );

    expect(transactionTeams).toBe(singleRosterTransactionTeams);
  });
});
