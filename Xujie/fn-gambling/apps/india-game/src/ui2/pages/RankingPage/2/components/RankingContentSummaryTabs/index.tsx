import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_JUSTIFY_END } from '@libs/constant/style';
import { handleRankingPageSummaryPeriodsTabBtnClick } from '@mode2/action/actionTypes';
import useRankingPageActions from '@libs/mode2/action/rankingPageAction/useRankingPageActions';
import {
  RankingPeriodsTabs,
  rankingPeriodsTabs,
  useRankingPageStore,
} from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { useTranslation } from 'react-i18next';

export const RankingContentSummaryTabs = () => {
  const { t } = useTranslation();
  const currentDisplayPeriodsActiveTab = useRankingPageStore(
    (state) => state.currentDisplayPeriodsActiveTab
  );

  const { handleRankingPageClick } = useRankingPageActions();

  return (
    <div className={cx('w-full', FLEX_CENTER, 'gap-5')}>
      {rankingPeriodsTabs.map((item) => {
        const isActive = currentDisplayPeriodsActiveTab === item.toUpperCase();

        return (
          <button
            key={`RankingContentSummaryTabs - ${item}`}
            className={cx(
              'w-[110px] h-9',
              FLEX_JUSTIFY_END,
              'flex-col',
              'items-center'
            )}
            onClick={() => {
              handleRankingPageClick({
                actionName: handleRankingPageSummaryPeriodsTabBtnClick,
                payload: {
                  tab: RankingPeriodsTabs[
                    `${item.toUpperCase() as keyof typeof RankingPeriodsTabs}`
                  ],
                },
              });
            }}
          >
            <div
              className={cx(FLEX_COL, 'gap-1', 'w-fit', {
                'bgi-text-[var(--grayscale-100)]': !isActive,
                'bgi-text-[var(--base-1-main)]': isActive,
              })}
            >
              <span className={cx('block', 'text-base')}>
                {t(`ranking_${item}_tab`)}
              </span>

              <div
                className={cx('w-full h-[2px]', {
                  'bg-transparent': !isActive,
                  'bgi-[var(--base-1-main)]': isActive,
                })}
              ></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RankingContentSummaryTabs;
