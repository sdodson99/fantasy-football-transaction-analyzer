import { TransactionLeagueType } from '../../../transactions/transaction';
import { CreateProcessedTransactionCommand } from '../create-processed-transaction-command';
import * as firebase from 'firebase-admin';
import { when } from 'jest-when';
import { ProcessedTransaction } from '../../processed-transaction';

describe('CreateProcessedTransactionCommand', () => {
  let command: CreateProcessedTransactionCommand;

  let mockDatabaseSet: jest.Mock;

  let leagueId: string;
  let leagueType: TransactionLeagueType;
  let processedTransaction: ProcessedTransaction;

  beforeEach(() => {
    leagueId = '123';
    leagueType = 'sleeper';
    processedTransaction = {
      transactionId: '1',
    } as ProcessedTransaction;

    mockDatabaseSet = jest.fn();
    const mockDatabaseRef = jest.fn();
    when(mockDatabaseRef)
      .calledWith(
        `/processed_transactions/league_types/${leagueType}/leagues/${leagueId}/transactions/${processedTransaction.transactionId}`
      )
      .mockReturnValue({
        set: mockDatabaseSet,
      });
    const mockFirebaseApp = {
      database: () => ({
        ref: mockDatabaseRef,
      }),
    } as unknown as firebase.app.App;

    command = new CreateProcessedTransactionCommand(mockFirebaseApp);
  });

  it('should set processed transactions in database', async () => {
    await command.execute(leagueId, leagueType, processedTransaction);

    expect(mockDatabaseSet).toBeCalledWith({
      transactionId: '1',
    });
  });
});
