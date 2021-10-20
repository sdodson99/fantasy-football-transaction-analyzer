import {
  KtcDraftPick,
  KtcPlayer,
} from '../../../transaction-assets/ktc/ktc-transaction-asset';
import { TransactionTeams } from '../../transaction-teams/transaction-teams';
import { KtcTransactionAnalysisLinkGenerator } from '../ktc-transaction-analysis-link-generator';

describe('KtcTransactionAnalysisLinkGenerator', () => {
  let linkGenerator: KtcTransactionAnalysisLinkGenerator;

  beforeEach(() => {
    linkGenerator = new KtcTransactionAnalysisLinkGenerator();
  });

  it('should return analysis link for transaction teams', () => {
    const transactionTeams: TransactionTeams = {
      team1: {
        players: [
          {
            id: '1',
          } as KtcPlayer,
          {
            id: '3',
          } as KtcPlayer,
        ],
        draftPicks: [],
      },
      team2: {
        players: [
          {
            id: '2',
          } as KtcPlayer,
        ],
        draftPicks: [
          {
            id: '5',
          } as KtcDraftPick,
        ],
      },
    };

    const link = linkGenerator.generate(transactionTeams);

    expect(link).toBe(
      'https://keeptradecut.com/trade-calculator?var=5&pickVal=0&format=1&teamOne=1|3&teamTwo=2|5'
    );
  });
});
