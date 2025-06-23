import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  X_CENTER,
} from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { useTranslation } from 'react-i18next';

export const RankingContentBottom = () => {
  const { t } = useTranslation();

  const mainContentMyRanking = useRankingPageStore(
    (state) => state.mainContentMyRanking
  );
  const ranking = mainContentMyRanking.currentRanking;
  const rankLeftValue = formatMoney({ value: mainContentMyRanking.ranksLeft });
  const reward = mainContentMyRanking.rewardRate;
  const myBet = mainContentMyRanking.betAmount;
  // lastRanking = 上次的排行名次、ranking = 當前的排行名次，若 ranking < lastRanking 應為上升符 / 反之則為下降符
  const isRise =
    mainContentMyRanking.currentRanking > mainContentMyRanking.lastRanking
      ? false
      : mainContentMyRanking.currentRanking < mainContentMyRanking.lastRanking
      ? true
      : undefined;
  const iconName =
    isRise === true ? 'rise' : isRise === false ? 'down' : 'stay';

  return (
    <div
      className={cx(
        'fixed bottom-0 z-[1001]',
        X_CENTER,
        'max-w-[750px]',
        'w-full h-[96px]',
        'bgi-[var(--base-2-variant14)]',
        FLEX_CENTER
      )}
    >
      <div
        className={cx(
          'w-full h-full',
          'py-[22px] px-4',
          FLEX_ITEMS_CENTER,
          'gap-[36px]'
        )}
      >
        {/* 排名 */}
        <div className={cx('flex-[1_1_21.1%] gap-0.5', FLEX_ITEMS_CENTER)}>
          {Number(ranking) < 500 && ranking !== 0 ? (
            <Icon name={`ic_ranking_${iconName}`} className="w-4 h-4" />
          ) : (
            <Icon name={`ic_ranking_stay`} className="w-4 h-4 mb-0.5" />
          )}

          <span
            className={cx(
              'block',
              'text-base',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {ranking ? ranking : t('ranking_no_rank')}
          </span>
        </div>

        {/* 投注 */}
        <div className={cx('flex-[1_1_39.4%]')}>
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
            <span
              className={cx('text-sm', 'bgi-text-[var(--state-error-main)]')}
            >
              {t('ranking_my_bets')}
            </span>
            <span className={cx('text-2xl', 'bgi-text-[var(--base-1-main)]')}>
              {myBet}
            </span>
          </div>

          <div className={cx(FLEX_ITEMS_CENTER, 'gap-1')}>
            <span
              className={cx('text-sm', 'bgi-text-[var(--state-error-main)]')}
            >
              {t('ranking_my_reward')}
            </span>
            <span
              className={cx('text-sm', 'bgi-text-[var(--state-error-main)]')}
            >
              {reward}%
            </span>
          </div>
        </div>

        {/* Rank Left */}
        <div className={cx('flex-[1_1_39.4%]', 'text-right', FLEX_COL)}>
          <span
            className={cx(
              'block',
              'text-sm',
              'bgi-text-[var(--state-error-main)]',
              'font-medium'
            )}
          >
            {t('ranking_ranks_left')}
          </span>
          <span
            className={cx(
              'block',
              'text-2xl',
              'bgi-text-[var(--base-1-main)]',
              'font-medium'
            )}
          >
            {rankLeftValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RankingContentBottom;
