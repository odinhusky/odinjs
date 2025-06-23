import { usePostInviteWheelWithdrawMutation } from '@libs/mode2/external/api';
import { useInviteWheelPageStoreStore } from '@libs/mode2/zustand/page/inviteWheelPageStore';
import { useEffect } from 'react';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '@mode2/utils';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

const useInviteWheel = () => {
  const { t } = useTranslation();

  const [postInviteWheelWithdraw, { isSuccess }] =
    usePostInviteWheelWithdrawMutation();

  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );

  const setRefreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.setRefreshInfoNumber
  );

  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const showToast = useToastStore((state) => state.showToast);
  const setIsShowInviteWheelTipsModal = useInviteWheelPageStoreStore(
    (state) => state.setIsShowInviteWheelTipsModal
  );
  const maxWheelReward = usePlatformDynamicConfigStore(
    (state) => state.maxWheelReward
  );
  const onInviteWheelWithdraw = () => {
    if (inviteWheelPortalInfo.isWithdrawal) {
      postInviteWheelWithdraw();
    } else {
      setIsShowInviteWheelTipsModal(true);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      showToast(
        t('spin_and_share_wheel_cash_out_toast', {
          maxWheelReward: formatMoney({ value: maxWheelReward }),
        }),
        () => {
          setRefreshInfoNumber();
          refreshUserData();
        }
      );
    }
  }, [isSuccess]);

  return {
    onInviteWheelWithdraw,
  };
};

export default useInviteWheel;
