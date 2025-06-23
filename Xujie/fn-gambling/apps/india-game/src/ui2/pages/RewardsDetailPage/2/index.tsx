import ClubRewardsDetailContent from '@components/ClubRewardsDetailContent';
import ClubWithdrawalHistoryContent from '@components/ClubWithdrawalHistoryContent';
import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';

import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import {
  EDetailContentId,
  useRewardsDetailStore,
} from '@mode2/zustand/page/rewardsDetailStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';

export const RewardsDetailPage = () => {
  const thisPath = BasePagePathObj.RewardsDetail;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const { t } = useTranslation();

  const recordDetailTab = useRewardsDetailStore(
    (state) => state.recordDetailTab
  );
  const withdrawalHistoryTab = useRewardsDetailStore(
    (state) => state.withdrawalHistoryTab
  );
  const activeDetailContentId = useRewardsDetailStore(
    (state) => state.activeDetailContentId
  );
  const resetRewardsDetail = useRewardsDetailStore(
    (state) => state.resetRewardsDetail
  );
  const setActiveDetailContent = useRewardsDetailStore(
    (state) => state.setActiveDetailContent
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: activeDetailContentId,
  });

  useEffect(() => {
    resetRewardsDetail();

    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: t('earn_rewards_detail_page_title') },
      });
    }
  }, []);

  return (
    <div className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'w-full flex flex-col')}>
      <div className="flex mx-auto mt-3 items-center rounded w-60 overflow-hidden bgi-[var(--grayscale-30)]">
        {[recordDetailTab, withdrawalHistoryTab].map((item) => (
          <div
            className={cx(
              ' flex-1 flex flex-col items-center rounded py-1  ',
              activeDetailContentId === item.id
                ? 'bgi-[var(--base-1-main)]'
                : ''
            )}
            key={item.id}
            onClick={() => setActiveDetailContent(item.id)}
          >
            <Icon
              className="w-4 h-4"
              name={item.icon}
              color="var(--grayscale-100)"
            />
            <span className="text-[var(--grayscale-100)] text-xs">
              {t(item.label)}
            </span>
          </div>
        ))}
      </div>
      {activeDetailContentId === EDetailContentId.RECORD_DETAIL ? (
        <ClubRewardsDetailContent />
      ) : (
        <ClubWithdrawalHistoryContent />
      )}
    </div>
  );
};
export default RewardsDetailPage;
