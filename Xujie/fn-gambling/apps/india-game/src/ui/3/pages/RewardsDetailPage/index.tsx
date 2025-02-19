import ClubRewardsDetailContent from '@components/ClubRewardsDetailContent';
import ClubWithdrawalHistoryContent from '@components/ClubWithdrawalHistoryContent';
import { cx } from '@libs/commonUtils';
import {
  RewardsDetailPageHeaderTabsTypes,
  useRewardsDetailStore,
} from '@mode2/zustand/page/rewardsDetailStore';
import useRewardsDetailPageHeaderSettingOverride from './useRewardsDetailPageHeaderSettingOverride';

const RewardsDetailPage = () => {
  useRewardsDetailPageHeaderSettingOverride();

  const { headerTabIndex } = useRewardsDetailStore();

  return (
    <div className={cx('w-full')}>
      {headerTabIndex === RewardsDetailPageHeaderTabsTypes.REWARDS_DETAIL ? (
        <ClubRewardsDetailContent />
      ) : (
        <ClubWithdrawalHistoryContent />
      )}
    </div>
  );
};
export default RewardsDetailPage;
