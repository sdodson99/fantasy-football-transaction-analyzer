import * as puppeteer from 'puppeteer';
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
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://sleeper.app/login');

    await page.type(
      '[placeholder="Enter email, phone, or username"]',
      this.botEmail
    );
    const continueButton = await page.$('.login-button');

    if (!continueButton) {
      throw new Error('Login continue button element not found.');
    }

    await continueButton.click();

    await page.waitForSelector('[placeholder="Enter password"]');
    await page.type('[placeholder="Enter password"]', this.botPassword);
    const loginButton = await page.$('.login-button');

    if (!loginButton) {
      throw new Error('Login button element not found.');
    }

    await loginButton.click();
    await page.waitForNavigation();

    await page.goto(`https://sleeper.app/leagues/${leagueId}`);

    const messageInput = await page.$('[placeholder="Enter Message"]');

    if (!messageInput) {
      throw new Error('Message input element not found.');
    }

    await messageInput.type('*SASA BOT*');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await messageInput.type(
      `Processed Transaction ID: ${processedTransaction.transactionId}`
    );
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await messageInput.type(
      `See the analysis here: ${processedTransaction.analysisUrl}`
    );

    await messageInput.press('Enter');

    await browser.close();
  }
}
