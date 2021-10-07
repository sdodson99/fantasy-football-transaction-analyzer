// import { getKeepTradeCutAssets } from './trade-assets/keep-trade-cut/get-keep-trade-cut-assets';
// import { getSleeperPlayers } from './trade-assets/sleeper/get-sleeper-players';
// import { getSleeperLeagueTrades } from './trades/sleeper/get-sleeper-league-trades';

// const keepTradeCutAssets = getKeepTradeCutAssets();

// console.log(keepTradeCutAssets);

// const sleeperPlayers = getSleeperPlayers();

// console.log(sleeperPlayers);

// const leagueId = '724028750487961600';
// const week = 4;

// (async () => {
//   const trades = await getSleeperLeagueTrades(leagueId, week);

//   trades.forEach((t) => {
//     console.log(t);
//   });
// })();

// SLEEPER BOT
// import dotenv from 'dotenv';
// import { chromium } from 'playwright';

// dotenv.config();

// (async () => {
//   const browser = await chromium.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.goto('https://sleeper.app/login');

//   const email: string = process.env.EMAIL?.toString() ?? '';
//   await page.fill('[placeholder="Enter email, phone, or username"]', email);
//   await page.click('text=Continue');

//   const password: string = process.env.PASSWORD?.toString() ?? '';
//   await page.fill('[placeholder="Enter password"]', password);
//   await page.click('.button-wrapper :text("Login")');

//   await page.waitForNavigation();

//   await page.goto('https://sleeper.app/leagues/724028750487961600');
//   await page.type('[placeholder="Enter Message"]', '*SASA BOT*');
//   await page.press('[placeholder="Enter Message"]', 'Shift+Enter');
//   await page.type('[placeholder="Enter Message"]', 'new line pls');

//   // await page.press('[placeholder="Enter Message"]', 'Enter');

//   await page.screenshot({ path: 'success.png' });

//   await browser.close();
// })();

import KtcPlayerData from './raw-data/ktc-player-data.json';

const data: Array<any> = KtcPlayerData as Array<any>;

console.log(data.length);
