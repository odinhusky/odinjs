import useActivityRecordPageBase from '@libs/mode2/usecase/page/activityRecordPage/useActivityRecordPageBase';
import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@libs/mode2/zustand/page/activityRecordPageStore';
import InviteWheelWithdrawalRecordContent from './components/InviteWheelWithdrawalRecordContent';
import RechargeWheelRewardsRecordContent from './components/RechargeWheelRewardsRecordContent';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

const ActivityRecordPage = () => {
  useActivityRecordPageBase();
  const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);
  return (
    <div className={MOBILE_BREAK_POINT_MAX_WIDTH}>
      {tabIndex ===
      ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT ? (
        <InviteWheelWithdrawalRecordContent />
      ) : tabIndex ===
        ActivityRecordPageTypes.RECHARGE_WHEEL_REWARDS_RECORD_CONTENT ? (
        <RechargeWheelRewardsRecordContent />
      ) : null}
    </div>
  );
};
export default ActivityRecordPage;
