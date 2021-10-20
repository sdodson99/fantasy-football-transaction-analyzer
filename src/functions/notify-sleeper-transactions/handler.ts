import { DateTime } from 'luxon';
import { logger } from '../../core/logger';
import { ProcessedTransaction } from '../../processed-transactions/processed-transaction';
import * as services from './services';
import { Config } from './config';

export const handleNotifySleeperTransactions = async () => {
  logger.info('Starting Sleeper league transactions notifier.', {
    leagueId: Config.LEAGUE_ID,
  });

  const serviceProvider = services.build(Config);

  const getLeagueTransactionsQuery =
    serviceProvider.resolveGetSleeperLeagueTransactionsQuery();
  const getProcessedTransactionsQuery =
    serviceProvider.resolveGetProcessedTransactionsQuery();
  const filterProcessedTransactions =
    serviceProvider.resolveFilterProcessedTransactions();
  const transactionAnalyzer = serviceProvider.resolveTransactionAnalyzer();
  const urlShortener = serviceProvider.resolveUrlShortener();
  const transactionNotifier = serviceProvider.resolveTransactionNotifier();
  const createProcessedTransactionCommand =
    serviceProvider.resolveCreateProcessedTransactionCommand();

  try {
    logger.info('Querying league transactions.');
    const transactions = await getLeagueTransactionsQuery.execute(
      Config.LEAGUE_ID,
      Config.NFL_WEEK
    );
    logger.info('Successfully queried league transactions.', {
      transactionCount: transactions.length,
    });

    logger.info('Querying processed league transactions.');
    const processedTransactions = await getProcessedTransactionsQuery.execute(
      Config.LEAGUE_ID,
      Config.LEAGUE_TYPE
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
        leagueId: Config.LEAGUE_ID,
        leagueType: Config.LEAGUE_TYPE,
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
        const notifyProcessedTransaction: ProcessedTransaction = {
          ...processedTransaction,
          analysisUrl: shortAnalysisUrl,
        };
        logger.info('Successfully shortened transaction analysis URL.', {
          shortedTransactionAnalysisUrl: notifyProcessedTransaction,
        });

        logger.info('Posting transaction to league chat.');
        await transactionNotifier.notify(
          Config.LEAGUE_ID,
          processedTransaction
        );
        logger.info('Successfully posted transaction to league chat.');
      }

      logger.info('Completing transaction.');
      await createProcessedTransactionCommand.execute(
        Config.LEAGUE_ID,
        Config.LEAGUE_TYPE,
        processedTransaction
      );
      logger.info('Successfully completed transaction.');
    }

    logger.info('Finished notifying league transactions.');
  } catch (error) {
    logger.error('Failed to notify league transactions.', {
      leagueId: Config.LEAGUE_ID,
      error,
    });
  }
};
