import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@constant/style';
import BaseModal from '@libs/components/Modal';
import React from 'react';
import { Icon } from '@components/Icon';
import RankingRewardsHistoryTabs from './components/RankingRewardsHistoryTabs';
import RankingRewardsHistoryJackpot from './components/RankingRewardsHistoryJackpot';
import { useTranslation } from 'react-i18next';
import useRankingHistoryModalAction from '@mode2/action/rankingHistoryModalAction/useRankingPageActions';
import { handleRankingHistoryModalCloseButtonClick } from '@mode2/action/rankingHistoryModalAction/actionType';
import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import useRankingRewardsHistoryModalBase from './useRankingRewardsHistoryModalBase';
import RankingRewardsHistoryTable from './components/RankingRewardsHistoryTable';

const RankingRewardsHistoryContent = () => {
  return (
    <div>
      <RankingRewardsHistoryJackpot />
      <RankingRewardsHistoryTabs />
      <RankingRewardsHistoryTable />
    </div>
  );
};

export const RankingRewardsHistoryModal = () => {
  useRankingRewardsHistoryModalBase();
  const { t } = useTranslation();
  const { handleRankingHistoryModalClick } = useRankingHistoryModalAction();
  const isShowRankingRewardsHistoryModal = useRankingRewardsHistoryModalStore(
    (state) => state.isShowRankingRewardsHistoryModal
  );
  return isShowRankingRewardsHistoryModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div
        className={cx(
          'relative',
          'max-w-[408px] w-full',
          FLEX_COL,
          // 'gap-3',
          'bgi-[var(--base-2-variant9)]',
          'bgi-border-[var(--base-1-main)] border rounded-xl'
        )}
      >
        <div
          className={cx('w-full relative px-4 pt-3 pb-2.5 mb-2', FLEX_CENTER)}
        >
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-1 w-full')}>
            <h4
              className={cx(
                'm-0 block w-full',
                'text-center bgi-text-[var(--grayscale-100)] text-lg font-medium'
              )}
            >
              {t('ranking_history_title')}
            </h4>
          </div>
          <Icon
            className={cx('w-6 h-6 absolute right-3 top-3 cursor-pointer')}
            name={'ic_close'}
            onClick={() => {
              handleRankingHistoryModalClick({
                actionName: handleRankingHistoryModalCloseButtonClick,
              });
            }}
          />
          <div className="absolute w-full bottom-0 bgi-border-b-[var(--transparent-white-10)] border-b" />
        </div>
        <RankingRewardsHistoryContent />
      </div>
    </BaseModal>
  ) : null;
};

export default RankingRewardsHistoryModal;
