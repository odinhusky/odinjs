import { usePostInviteWheelSpinMutation } from '@mode2API/index';
import { useDeepEffect } from '@libs/commonUtils';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useToastStore } from '@mode2/zustand/components/toastStore';

/**
 * 邀請輪盤控制邏輯
 */
export const useInviteSpinWheelBase = () => {
  const { t } = useTranslation();
  const [postInviteWheelSpin, { data, isSuccess, isLoading }] =
    usePostInviteWheelSpinMutation();

  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );

  const spinWheelCount = useInviteWheelPageStoreStore(
    (state) => state.spinWheelCount
  );
  const setSpinedIndex = useInviteWheelPageStoreStore(
    (state) => state.setSpinedIndex
  );
  const setSpinedReward = useInviteWheelPageStoreStore(
    (state) => state.setSpinedReward
  );
  const spinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.spinFastTotate
  );
  const setSpinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.setSpinFastTotate
  );

  const setRefreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.setRefreshInfoNumber
  );

  const showToast = useToastStore((state) => state.showToast);

  useDeepEffect(() => {
    // API取得的reward 找出 對應的 index
    const wheelSegments = get(inviteWheelPortalInfo, 'wheelSegments', []);
    // const cumulativeReward = get(inviteWheelPortalInfo, 'cumulativeReward', 0); // 累積獎勵

    const segmentIndex = wheelSegments.findIndex(
      (item) =>
        Array.isArray(item.value) && item.value.includes(data?.reward || 0)
    );

    if (isSuccess && data) {
      setSpinedIndex(segmentIndex);
      setSpinedReward(data.reward);

      // Show Toast
      const winPrizeToastId = uuidv4();
      showToast(
        t('spin_and_share_wheel_win_prize_toast', {
          rewardAmount: formatMoney(data.reward, true),
        }),
        (id) => {
          if (id === winPrizeToastId) {
            // Toast 消失後刷新資料
            setRefreshInfoNumber();
          }
        },
        winPrizeToastId
      );
    }
  }, [data, isSuccess]);

  useDeepEffect(() => {
    if (spinFastTotate && spinWheelCount === 1) {
      postInviteWheelSpin();
      setSpinFastTotate(false);
    }
  }, [spinWheelCount, isLoading]);
};

export default useInviteSpinWheelBase;
