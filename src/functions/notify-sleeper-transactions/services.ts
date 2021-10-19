import { KtcTransactionAnalysisLinkGenerator } from '../../analyze-transactions/services/ktc-transaction-analysis-link-generator';
import { TransactionAnalyzer } from '../../analyze-transactions/transaction-analyzer';
import { BitlyUrlShortener } from '../../core/bitly-url-shortener';
import { SleeperTransactionNotifier } from '../../notify-sleeper-transactions/sleeper-transaction-notifier';
import { CreateProcessedTransactionCommand } from '../../processed-transactions/commands/create-processed-transaction-command';
import { GetProcessedTransactionsQuery } from '../../processed-transactions/queries/get-processed-transactions-query';
import { filterProcessedTransactions } from '../../processed-transactions/services/filter-processed-transactions';
import { GetSleeperLeagueTransactionsQuery } from '../../sleeper-transactions/queries/get-sleeper-league-transactions-query';
import { firebaseApp } from '../../startup/firebase-app';
import { GetByDetailsKtcDraftPickQuery } from '../../transaction-assets/ktc/queries/get-by-details-ktc-draft-pick-query';
import { GetByDetailsKtcPlayerQuery } from '../../transaction-assets/ktc/queries/get-by-details-ktc-player-query';
import { GetManyByDetailsKtcDraftPicksQuery } from '../../transaction-assets/ktc/queries/get-many-by-details-ktc-draft-picks-query';
import { ManySleeperToKtcPlayersConverter } from '../../transaction-assets/services/many-sleeper-to-ktc-players-converter';
import { SleeperToKtcPlayerConverter } from '../../transaction-assets/services/sleeper-to-ktc-player-converter';
import { GetByIdSleeperPlayerQuery } from '../../transaction-assets/sleeper/queries/get-by-id-sleeper-player-query';
import { NotifySleeperTransactionsConfig } from './config';

export const build = (config: NotifySleeperTransactionsConfig) => {
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
  const manySleeperToKtcPlayersConverter = new ManySleeperToKtcPlayersConverter(
    sleeperToKtcPlayerConverter
  );
  const getByDetailsKtcDraftPickQuery = new GetByDetailsKtcDraftPickQuery(
    firebaseApp
  );
  const getManyByDetailsKtcDraftPicksQuery =
    new GetManyByDetailsKtcDraftPicksQuery(getByDetailsKtcDraftPickQuery);
  const ktcTransactionAnalysisLinkGenerator =
    new KtcTransactionAnalysisLinkGenerator();

  const getLeagueTransactionsQuery = new GetSleeperLeagueTransactionsQuery();
  const getProcessedTransactionsQuery = new GetProcessedTransactionsQuery(
    firebaseApp
  );
  const transactionAnalyzer = new TransactionAnalyzer(
    manySleeperToKtcPlayersConverter,
    getManyByDetailsKtcDraftPicksQuery,
    ktcTransactionAnalysisLinkGenerator
  );
  const urlShortener = new BitlyUrlShortener(config.BITLY_ACCESS_TOKEN);
  const transactionNotifier = new SleeperTransactionNotifier(
    config.SLEEPER_BOT_EMAIL,
    config.SLEEPER_BOT_PASSWORD
  );
  const createProcessedTransactionCommand =
    new CreateProcessedTransactionCommand(firebaseApp);

  return {
    resolveGetSleeperLeagueTransactionsQuery: () => getLeagueTransactionsQuery,
    resolveGetProcessedTransactionsQuery: () => getProcessedTransactionsQuery,
    resolveFilterProcessedTransactions: () => filterProcessedTransactions,
    resolveTransactionAnalyzer: () => transactionAnalyzer,
    resolveUrlShortener: () => urlShortener,
    resolveTransactionNotifier: () => transactionNotifier,
    resolveCreateProcessedTransactionCommand: () =>
      createProcessedTransactionCommand,
  };
};
