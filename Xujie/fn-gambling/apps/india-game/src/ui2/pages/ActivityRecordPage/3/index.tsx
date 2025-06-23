import useActivityRecordPageBase from '@libs/mode2/usecase/page/activityRecordPage/useActivityRecordPageBase';
import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@libs/mode2/zustand/page/activityRecordPageStore';
import InviteWheelWithdrawalRecordContent from './components/InviteWheelWithdrawalRecordContent';
import RechargeWheelRewardsRecordContent from './components/RechargeWheelRewardsRecordContent';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import useMobileExclusiveActivityRecordPageOverride from './useMobileExclusiveActivityRecordPageOverride';
import TaskRewardsRecordContent from './components/TaskRewardsRecordContent';
import { useMemo } from 'react';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

export const ActivityRecordPage = () => {
  useActivityRecordPageBase();
  useMobileExclusiveActivityRecordPageOverride();
  const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: tabIndex.toString(),
  });

  const ruleContent = useMemo(() => {
    switch (tabIndex) {
      case ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT:
        return <InviteWheelWithdrawalRecordContent />;
      case ActivityRecordPageTypes.RECHARGE_WHEEL_REWARDS_RECORD_CONTENT:
        return <RechargeWheelRewardsRecordContent />;
      case ActivityRecordPageTypes.MISSION_REWARDS_RECORD_CONTENT:
        return <TaskRewardsRecordContent />;
      default:
        return null;
    }
  }, [tabIndex]);

  return <div className={MOBILE_BREAK_POINT_MAX_WIDTH}>{ruleContent}</div>;
};
export default ActivityRecordPage;
