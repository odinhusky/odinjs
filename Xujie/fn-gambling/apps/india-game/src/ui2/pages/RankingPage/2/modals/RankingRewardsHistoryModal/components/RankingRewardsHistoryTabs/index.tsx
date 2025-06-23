import { EResourceLevel, getImgUrl } from '@mode2/utils';
import React from 'react';
import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import renderI18N from '@commonUtils/renderI18N';
import useRankingHistoryModalAction from '@mode2/action/rankingHistoryModalAction/useRankingPageActions';
import { handleRankingHistoryModalTabClick } from '@mode2/action/rankingHistoryModalAction/actionType';
import { RankingHistoryType } from '@mode2API/endpoint/ranking/PostRankingHistoryEndpoint';

const HistoryTabs = (props: { tab: RankingHistoryType; i18nKey: string }) => {
  const { t } = useTranslation();
  const { handleRankingHistoryModalClick } = useRankingHistoryModalAction();
  const rewardsHistoryTab = useRankingRewardsHistoryModalStore(
    (state) => state.rewardsHistoryTab
  );
  return (
    <div
      className={cx(
        'bgi-text-[var(--base-2-variant2)] text-sm font-medium',
        'cursor-pointer',
        'w-full',
        {
          'bgi-text-[var(--grayscale-100)]': props.tab === rewardsHistoryTab,
        }
      )}
      onClick={() => {
        handleRankingHistoryModalClick({
          actionName: handleRankingHistoryModalTabClick,
          payload: {
            tab: props.tab,
          },
        });
      }}
    >
      {renderI18N(props, t)}
    </div>
  );
};

export const RankingRewardsHistoryTabs = () => {
  return (
    <div className="flex justify-evenly items-center text-center py-2.5 my-2">
      <HistoryTabs
        tab={RankingHistoryType.D}
        i18nKey={'ranking_history_last_day_tab'}
      />
      <img
        className="h-5 w-auto"
        alt={'tab_bar_divider'}
        src={getImgUrl(EResourceLevel.V, 'tab_bar_divider')}
      />
      <HistoryTabs
        tab={RankingHistoryType.W}
        i18nKey={'ranking_history_last_week_tab'}
      />
      <img
        className="h-5 w-auto"
        alt={'tab_bar_divider'}
        src={getImgUrl(EResourceLevel.V, 'tab_bar_divider')}
      />
      <HistoryTabs
        tab={RankingHistoryType.M}
        i18nKey={'ranking_history_last_month_tab'}
      />
    </div>
  );
};

export default RankingRewardsHistoryTabs;
