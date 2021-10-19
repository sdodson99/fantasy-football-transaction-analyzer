import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { firebaseApp } from '../../startup/firebase-app';
import { logger } from '../../core/logger';
import { TransactionAnalyzer } from '../../analyze-transactions/transaction-analyzer';
import { BitlyUrlShortener } from '../../core/bitly-url-shortener';
import { KtcTransactionAnalysisLinkGenerator } from '../../analyze-transactions/services/ktc-transaction-analysis-link-generator';
import { SleeperTransactionNotifier } from '../../notify-sleeper-transactions/sleeper-transaction-notifier';
import { CreateProcessedTransactionCommand } from '../../processed-transactions/commands/create-processed-transaction-command';
import { ProcessedTransaction } from '../../processed-transactions/processed-transaction';
import { GetProcessedTransactionsQuery } from '../../processed-transactions/queries/get-processed-transactions-query';
import { filterProcessedTransactions } from '../../processed-transactions/services/filter-processed-transactions';
import { GetSleeperLeagueTransactionsQuery } from '../../sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { GetByDetailsKtcDraftPickQuery } from '../../transaction-assets/ktc/queries/get-by-details-ktc-draft-pick-query';
import { GetByDetailsKtcPlayerQuery } from '../../transaction-assets/ktc/queries/get-by-details-ktc-player-query';
import { GetManyByDetailsKtcDraftPicksQuery } from '../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query';
import { ManySleeperToKtcPlayersConverter } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter';
import { SleeperToKtcPlayerConverter } from '../../transaction-assets/services/sleeper-to-ktc-player-converter';
import { GetByIdSleeperPlayerQuery } from '../../transaction-assets/sleeper/queries/get-by-id-sleeper-player-query';
import { TransactionLeagueType } from '../../transactions/transaction';

const leagueId = functions.config().sleeper_league.id;
const sleeperBotEmail = functions.config().sleeper_bot.email;
const sleeperBotPassword = functions.config().sleeper_bot.password;
const bitlyAccessToken = functions.config().bitly.access_token;
const nflWeek = functions.config().nfl.week;
const leagueType: TransactionLeagueType = 'sleeper';

export const notifySleeperTransactions = functions
  .runWith({
    memory: '512MB',
    timeoutSeconds: 300,
  })
  .pubsub.schedule('0 * * * *')
  .onRun(async () => {
    logger.info('Starting Sleeper league transactions notifier.', {
      leagueId,
    });

    const getLeagueTransactionsQuery = new GetSleeperLeagueTransactionsQuery();
    const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
      firebaseApp
    );
    const getByIdTransactionPlayerQuery = new GetByIdSleeperPlayerQuery(
      firebaseApp
    );
    const getByDetailsKtcPlayerQuery = new GetByDetailsKtcPlayerQuery(
      firebaseApp
    );
    const sleeperToKtcPlayerConverter = new SleeperToKtcPlayerConverter(
      getByIdTransactionPlayerQuery,
      getByDetailsKtcPlayerQuery
    );
    const manySleeperToKtcPlayersConverter =
      new ManySleeperToKtcPlayersConverter(sleeperToKtcPlayerConverter);
    const getByDetailsKtcDraftPickQuery = new GetByDetailsKtcDraftPickQuery(
      firebaseApp
    );
    const getManyByDetailsKtcDraftPicksQuery =
      new GetManyByDetailsKtcDraftPicksQuery(getByDetailsKtcDraftPickQuery);
    const ktcTransactionAnalysisLinkGenerator =
      new KtcTransactionAnalysisLinkGenerator();
    const transactionAnalyzer = new TransactionAnalyzer(
      manySleeperToKtcPlayersConverter,
      getManyByDetailsKtcDraftPicksQuery,
      ktcTransactionAnalysisLinkGenerator
    );
    const createProcessedTransactionCommand =
      new CreateProcessedTransactionCommand(firebaseApp);
    const urlShortener = new BitlyUrlShortener(bitlyAccessToken);
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

        const processedTransaction: ProcessedTransaction = {
          transactionId: currentUnprocessedTransaction.id,
          type: currentUnprocessedTransaction.type,
          leagueId,
          leagueType,
          week: currentUnprocessedTransaction.week,
          analysisUrl: transactionAnalysisUrl,
          processedEpochMillis: DateTime.now().toMillis(),
        };

        // Only post trades for now.
        if (processedTransaction.type === 'trade') {
          logger.info('Shortening transaction analysis URL.');
          const shortAnalysisUrl = await urlShortener.shorten(
            transactionAnalysisUrl
          );
          processedTransaction.analysisUrl = shortAnalysisUrl;
          logger.info('Successfully shortened transaction analysis URL.', {
            shortAnalysisUrl,
          });

          logger.info('Posting transaction to league chat.');
          await transactionNotifier.notify(leagueId, processedTransaction);
          logger.info('Successfully posted transaction to league chat.');
        }

        logger.info('Completing transaction.');
        await createProcessedTransactionCommand.execute(
          leagueId,
          leagueType,
          processedTransaction
        );
        logger.info('Successfully completed transaction.');
      }

      logger.info('Finished notifying league transactions.');
    } catch (error) {
      logger.error('Failed to notify league transactions.', {
        leagueId: leagueId,
        error,
      });
    }
  });
