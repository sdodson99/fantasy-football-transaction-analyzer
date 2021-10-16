import { chromium } from 'playwright';
import { ProcessedTransaction } from '../processed-transactions/processed-transaction';

/**
 * Service to post processed Sleeper transaction in Sleeper league chat.
 */
export class SleeperTransactionNotifier {
  /**
   * Initialize with bot credentials.
   * @param botEmail The email of the bot that posts the transaction.
   * @param botPassword The password of the bot that posts the transaction.
   */
  constructor(private botEmail: string, private botPassword: string) {}

  /**
   * Post a processed Sleeper transaction in the Sleeper league chat.
   * @param leagueId The ID of the league.
   * @param processedTransaction The processed transaction to post.
   */
  async notify(leagueId: string, processedTransaction: ProcessedTransaction) {
    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();
    await page.goto('https://sleeper.app/login');

    await page.fill(
      '[placeholder="Enter email, phone, or username"]',
      this.botEmail
    );
    await page.click('text=Continue');

    await page.fill('[placeholder="Enter password"]', this.botPassword);
    await page.click('.button-wrapper :text("Login")');
    await page.waitForNavigation();

    await page.goto(`https://sleeper.app/leagues/${leagueId}`);

    await page.type('[placeholder="Enter Message"]', '*SASA BOT*');
    await page.press('[placeholder="Enter Message"]', 'Shift+Enter');
    await page.type(
      '[placeholder="Enter Message"]',
      `Processed Transaction ID: ${processedTransaction.transactionId}`
    );
    await page.press('[placeholder="Enter Message"]', 'Shift+Enter');
    await page.type(
      '[placeholder="Enter Message"]',
      `See the analysis here: ${processedTransaction.analysisUrl}`
    );

    await page.press('[placeholder="Enter Message"]', 'Enter');

    await browser.close();
  }
}
