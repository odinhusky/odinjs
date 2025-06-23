import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { RankingContentSummaryProps } from '../RankingContentSummary';

export type RankingContentSummaryJockPotBottomTextProps = Pick<
  RankingContentSummaryProps,
  'isModalMode'
>;

export const RankingContentSummaryJockPotBottomText = ({
  isModalMode,
}: RankingContentSummaryJockPotBottomTextProps) => {
  const { t } = useTranslation();
  const mainContentJackpotRate = useRankingPageStore(
    (state) => state.mainContentJackpotRate
  );

  return (
    <div className={cx(FLEX_CENTER, 'gap-[6px]', 'h-4', 'w-screen')}>
      <Icon name="ic_tips_2_outline" className="w-4 h-4" />

      <span
        className={cx('block', 'bgi-text-[var(--grayscale-100)]', 'text-xs', {
          'text-xxs': isModalMode,
        })}
      >
        {t('ranking_percent_of_total_bets', {
          jackpotRate: `${(mainContentJackpotRate * 1000).toFixed(1) || 1}`,
          productName: `${import.meta.env['VITE_PLATFORM'] || '7IND'}`,
        })}
      </span>
    </div>
  );
};

export default RankingContentSummaryJockPotBottomText;
