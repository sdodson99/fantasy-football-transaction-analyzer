import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { GetSleeperLeagueTransactionsQuery } from './sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { GetProcessedTransactionsQuery } from './processed-transactions/queries/get-processed-transactions-query';
import { filterProcessedTransactions } from './processed-transactions/services/filter-processed-transactions';
import { TransactionAnalyzer } from './analyze-transactions/transaction-analyzer';
import { CreateProcessedTransactionCommand } from './processed-transactions/commands/create-processed-transaction-command';
import { TransactionLeagueType } from './transactions/transaction';
import { ProcessedTransaction } from './processed-transactions/processed-transaction';
import { DateTime } from 'luxon';
import { SleeperTransactionNotifier } from './notify-sleeper-transactions/sleeper-transaction-notifier';
import { GetAllSleeperApiPlayersQuery } from './transaction-assets/sleeper/queries/get-all-sleeper-api-players-query';
import { SaveAllSleeperPlayersCommand } from './transaction-assets/sleeper/commands/save-all-sleeper-players-command';
import { GetAllKtcStoredTransactionAssetsQuery } from './transaction-assets/ktc/queries/get-all-ktc-stored-transaction-assets-query';
import { SaveAllKtcPlayersCommand } from './transaction-assets/ktc/commands/save-all-ktc-players-command';
import { SaveAllKtcDraftPicksCommand } from './transaction-assets/ktc/commands/save-all-ktc-draft-picks-command';

const firebaseApp = firebase.initializeApp();
const logger = functions.logger;

const leagueId = functions.config().sleeperLeague.id;
const leagueType: TransactionLeagueType = 'sleeper';
const nflWeek = 4;
const sleeperBotEmail = functions.config().sleeperBot.email;
const sleeperBotPassword = functions.config().sleeperBot.password;

export const notifySleeperTransactions = functions.pubsub
  .schedule('*/30 * * * *')
  .onRun(async () => {
    logger.info('Starting Sleeper league transactions notifier.', {
      leagueId,
    });

    const getLeagueTransactionsQuery = new GetSleeperLeagueTransactionsQuery();
    const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
      firebaseApp
    );
    const transactionAnalyzer = new TransactionAnalyzer();
    const createProcessedTransactionCommand =
      new CreateProcessedTransactionCommand(firebaseApp);
    const transactionNotifier = new SleeperTransactionNotifier(
      sleeperBotEmail,
      sleeperBotPassword
    );

    try {
      logger.info('Querying league transactions.');
      const transactions = await getLeagueTransactionsQuery.execute(
        leagueId,
        nflWeek
      );
      logger.info('Successfully queried league transactions.', {
        transactionCount: transactions.length,
      });

      logger.info('Querying processed league transactions.');
      const processedTransactions = await getProcessedTransactionsQuery.execute(
        leagueId,
        leagueType
      );
      logger.info('Successfully queried processed league transactions.', {
        processedTransactionsCount: processedTransactions.length,
      });

      logger.info('Filtering out already processed league transactions.');
      const unprocessedTransactions = filterProcessedTransactions(
        transactions,
        processedTransactions
      );
      logger.info('Filtered out already processed league transactions.', {
        unprocessedTransactionsCount: unprocessedTransactions.length,
      });

      if (unprocessedTransactions.length === 0) {
        return logger.info('No transactions to process.', {
          unprocessedTransactionsCount: unprocessedTransactions.length,
        });
      }

      for (let index = 0; index < unprocessedTransactions.length; index++) {
        const currentUnprocessedTransaction = unprocessedTransactions[index];

        logger.info('Analyzing transaction.', {
          transactionId: currentUnprocessedTransaction.id,
        });
        const transactionAnalysisUrl = await transactionAnalyzer.analyze(
          currentUnprocessedTransaction
        );
        logger.info('Successfully analyzed transaction.', {
          analysisUrl: transactionAnalysisUrl,
        });

        logger.info('Completing transaction.');
        const processedTransaction: ProcessedTransaction = {
          transactionId: currentUnprocessedTransaction.id,
          type: currentUnprocessedTransaction.type,
          leagueId,
          leagueType,
          week: currentUnprocessedTransaction.week,
          analysisUrl: transactionAnalysisUrl,
          processedEpochMillis: DateTime.now().toMillis(),
        };
        await createProcessedTransactionCommand.execute(
          leagueId,
          leagueType,
          processedTransaction
        );
        logger.info('Successfully completed transaction.');

        logger.info('Posting transaction to league chat.');
        // await transactionNotifier.notify(leagueId, processedTransaction);
        logger.info('Successfully posted transaction to league chat.');
      }

      logger.info('Finished notifying league transactions.');
    } catch (error) {
      logger.error('Failed to notify league transactions.', {
        leagueId: leagueId,
        error,
      });
    }
  });

export const updateSleeperPlayers = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(async () => {
    logger.info('Starting Sleeper players update.');

    try {
      const getAllSleeperApiPlayersQuery = new GetAllSleeperApiPlayersQuery();
      const saveAllSleeperPlayersCommand = new SaveAllSleeperPlayersCommand(
        firebaseApp
      );

      logger.info('Querying all Sleeper players.');
      const sleeperPlayers = await getAllSleeperApiPlayersQuery.execute();
      logger.info('Successfully queried all Sleeper players.', {
        sleeperPlayersCount: sleeperPlayers.length,
      });

      logger.info('Saving all Sleeper players.');
      await saveAllSleeperPlayersCommand.execute(sleeperPlayers);

      logger.info('Successfully updated Sleeper players.');
    } catch (error) {
      logger.error('Failed to update Sleeper players.', {
        error,
      });
    }
  });

export const updateKtcTransactionAssets = functions.storage
  .object()
  .onFinalize(async (file) => {
    logger.info('Detected Firebase Storage file creation.');

    if (file.name !== 'ktc-players.json') {
      return logger.info(
        'Created file was not for KTC players update. Maybe next time...',
        { fileName: file.name }
      );
    }

    logger.info('Starting KTC transaction assets update.');

    const getAllKtcStoredTransactionAssetsQuery =
      new GetAllKtcStoredTransactionAssetsQuery(firebaseApp);
    const saveAllKtcPlayersCommand = new SaveAllKtcPlayersCommand(firebaseApp);
    const saveAllKtcDraftPicksCommand = new SaveAllKtcDraftPicksCommand(
      firebaseApp
    );

    try {
      logger.info('Querying all Sleeper transaction assets.');
      const { players, draftPicks } =
        await getAllKtcStoredTransactionAssetsQuery.execute();
      logger.info('Successfully queried all KTC transaction assets.', {
        ktcDraftPicksCount: draftPicks.length,
        ktcPlayersCount: players.length,
      });

      logger.info('Saving all KTC players.');
      await saveAllKtcPlayersCommand.execute(players);

      logger.info('Saving all KTC draft picks.');
      await saveAllKtcDraftPicksCommand.execute(draftPicks);

      logger.info('Successfully updated KTC transaction assets.');
    } catch (error) {
      logger.error('Failed to update KTC transaction assets.', {
        error,
      });
    }
  });
