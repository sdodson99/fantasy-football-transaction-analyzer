# Fantasy Football Transaction Analyzer

Analyze Sleeper fantasy football league transactions using [KeepTradeCut](https://keeptradecut.com/trade-calculator) to see who won or lost a trade. Analysis link is automatically posted to the Sleeper league chat.

# Table of Contents

- [Description](#description)
- [Features](#features)
- [Technology](#technology)
- [How to Run Locally](#how-to-run-locally)
- [Contributing](#contributing)

# Description

Need to see who won or lost a trade in your fantasy football league? Suspect some transactions in your league are driven by collusion? Use the Fantasy Football Transaction Analyzer to analyze your league's transactions and post an analysis to your league's chat automatically.

# Features

- Analyze Sleeper fantasy football league transactions
- Post transaction analysis link to Sleeper league chat
- Execute transaction analysis automatically via Firebase CRON function

# Technology

- Typescript
- Firebase (Functions, Realtime Database, Storage)
- Puppeteer
- Unit Testing w/ Jest

# How to Run Locally

Follow the following steps to run the analyzer locally after cloning.

## Prerequisites

- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)
- [Bitly Access Token](https://dev.bitly.com/docs/getting-started/authentication)
- [Sleeper Fantasy Football League](https://sleeper.app/)

## Steps

1. Install packages

```
npm install
```

2. Install Firebase emulators (Functions, Database, Storage)

```
firebase init emulators
```

3. Create a file named '.runtimeconfig.json' with the following environment variables

```
{
  "sleeper_league": {
    "id": "<LEAGUE_ID>"
  },
  "sleeper_bot": {
    "email": "<SLEEPER_LEAGUE_USER_EMAIL>",
    "password": "<SLEEPER_LEAGUE_USER_PASSWORD>"
  },
  "bitly": {
    "access_token": "<BITLY_ACCESS_TOKEN>"
  }
}
```

4. Start the Firebase emulators

```
npm run start:emulators
```

5. Add KTC transaction assets to the Firebase Storage emulator

- Download [ktc-players.json](https://firebasestorage.googleapis.com/v0/b/fantasy-transaction-analyzer.appspot.com/o/ktc-players.json?alt=media&token=ca5187de-2930-4def-bb72-6436eff8771c)
- Upload ktc-players.json to the [Firebase Storage emulator](http://localhost:4000/storage)

6. Start the Firebase Functions shell

```
npm run start
```

7. Run functions from Firebase Functions shell

- Populate Sleeper players

```
updateSleeperPlayers()
```

- Populate KTC transaction assets

```
updateKtcTransactionAssets({name: 'ktc-players.json'})
```

- Analyze and post Sleeper league transactions

```
notifySleeperTransactions()
```

# Contributing

Please create a new issue if you have any questions, problems, or suggestions. Feel free to open a
pull request if you have a feature or fix you want to contribute to the project.
