import ClubRewardsDetailContent from '@components/ClubRewardsDetailContent';
import ClubWithdrawalHistoryContent from '@components/ClubWithdrawalHistoryContent';
import { cx } from '@libs/commonUtils';
import {
  RewardsDetailPageHeaderTabsTypes,
  useRewardsDetailStore,
} from '@mode2/zustand/page/rewardsDetailStore';
import useRewardsDetailPageHeaderSettingOverride from './useRewardsDetailPageHeaderSettingOverride';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

export const RewardsDetailPage = () => {
  useRewardsDetailPageHeaderSettingOverride();

  const headerTabIndex = useRewardsDetailStore((state) => state.headerTabIndex);

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: headerTabIndex,
  });

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -ml-4 h-screen px-4',
        'bgi-[var(--background-dark)]'
      )}
    >
      {headerTabIndex === RewardsDetailPageHeaderTabsTypes.REWARDS_DETAIL ? (
        <ClubRewardsDetailContent />
      ) : (
        <ClubWithdrawalHistoryContent />
      )}
    </div>
  );
};
export default RewardsDetailPage;
