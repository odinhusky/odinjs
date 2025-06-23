import { useDeepEffect, useDurationCountDown } from '@libs/commonUtils';
import { formatCountdownTime } from '@libs/mode2/utils';
import { useInviteWheelPageStoreStore } from '@libs/mode2/zustand/page/inviteWheelPageStore';
import { useTranslation } from 'react-i18next';

// Evan Done
/**
 * 下次免費 Spin 刷新時間
 * @constructor
 */
export const InviteWheelResetTips = () => {
  const { t } = useTranslation();
  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );

  const refreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.refreshInfoNumber
  );

  const setRefreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.setRefreshInfoNumber
  );

  const { remainSec } = useDurationCountDown({
    forceUpdateDurationCount: refreshInfoNumber,
    duration: inviteWheelPortalInfo.nextFreeSpinCountDown,
    key: 'nextFreeSpinCountDown',
  });

  useDeepEffect(() => {
    if (remainSec <= 0) {
      setRefreshInfoNumber();
    }
  }, [remainSec]);

  return (
    <div className="mt-1.5 text-sm font-medium bgi-text-[var(--base-2-variant1)]">
      {t('spin_and_share_wheel_next_free_spin')}&nbsp;:&nbsp;
      {formatCountdownTime(remainSec)}
    </div>
  );
  // return !inviteWheelPortalInfo.isWithdrawal ? (
  //   <div className="mt-1.5 text-sm font-medium bgi-text-[var(--base-2-variant1)]">
  //     {t('spin_and_share_wheel_next_free_spin')}&nbsp;:&nbsp;
  //     {formatCountdownTime(remainSec)}
  //   </div>
  // ) : null;
};

export default InviteWheelResetTips;
