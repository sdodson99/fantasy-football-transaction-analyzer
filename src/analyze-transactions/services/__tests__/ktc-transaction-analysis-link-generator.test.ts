import { KtcPlayer } from '../../../transaction-assets/ktc/ktc-transaction-asset';
import { TransactionTeams } from '../../transaction-teams';
import { KtcTransactionAnalysisLinkGenerator } from '../ktc-transaction-analysis-link-generator';

describe('KtcTransactionAnalysisLinkGenerator', () => {
  let linkGenerator: KtcTransactionAnalysisLinkGenerator;

  beforeEach(() => {
    linkGenerator = new KtcTransactionAnalysisLinkGenerator();
  });

  it('should return analysis link for transaction teams', () => {
    const transactionTeams: TransactionTeams = {
      team1: [
        {
          id: '1',
        } as KtcPlayer,
        {
          id: '3',
        } as KtcPlayer,
      ],
      team2: [
        {
          id: '2',
        } as KtcPlayer,
      ],
    };

    const link = linkGenerator.generate(transactionTeams);

    expect(link).toBe(
      'https://keeptradecut.com/trade-calculator?var=5&pickVal=0&format=1&teamOne=1|3&teamTwo=2'
    );
  });
});
