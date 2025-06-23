import { usePostInviteWheelSpinMutation } from '@mode2API/index';
import { useDeepEffect } from '@libs/commonUtils';
import get from 'lodash/get';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useEffect } from 'react';

/**
 * 邀請輪盤控制邏輯
 */
export const useInviteSpinWheelBase = () => {
  // const { t } = useTranslation();
  const [postInviteWheelSpin, { data, isSuccess, isLoading, isError }] =
    usePostInviteWheelSpinMutation();

  const inviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelPortalInfo
  );
  const spinWheelCount = useInviteWheelPageStoreStore(
    (state) => state.spinWheelCount
  );
  const inviteWheelSpinToastFinish = useInviteWheelPageStoreStore(
    (state) => state.inviteWheelSpinToastFinish
  );

  const setPrizeWheelIndex = useInviteWheelPageStoreStore(
    (state) => state.setPrizeWheelIndex
  );
  const setSpinedReward = useInviteWheelPageStoreStore(
    (state) => state.setSpinedReward
  );
  const setSpinFastTotate = useInviteWheelPageStoreStore(
    (state) => state.setSpinFastTotate
  );
  // const setRefreshInfoNumber = useInviteWheelPageStoreStore((state) => state.setRefreshInfoNumber);
  const setInviteWheelSpinToastFinish = useInviteWheelPageStoreStore(
    (state) => state.setInviteWheelSpinToastFinish
  );
  const resetSpinWheel = useInviteWheelPageStoreStore(
    (state) => state.resetSpinWheel
  );

  // const showToast = useToastStore((state) => state.showToast);

  useDeepEffect(() => {
    // API取得的reward 找出 對應的 index
    const wheelSegments = get(inviteWheelPortalInfo, 'wheelSegments', []);

    const segmentIndex = wheelSegments.findIndex(
      (item) =>
        Array.isArray(item.value) && item.value.includes(data?.reward || 0)
    );

    if (isSuccess) {
      setSpinFastTotate(false);
    }

    if (isSuccess && data && !inviteWheelSpinToastFinish) {
      if (segmentIndex >= 0) {
        setPrizeWheelIndex(segmentIndex);
      }
      setSpinedReward(data.reward);
    }
  }, [data, isSuccess, inviteWheelSpinToastFinish]);

  useDeepEffect(() => {
    if (isError) {
      setSpinFastTotate(false);
      setInviteWheelSpinToastFinish(true);
      resetSpinWheel();
    }
  }, [isError]);

  useDeepEffect(() => {
    if (spinWheelCount == 1 && !isLoading && inviteWheelSpinToastFinish) {
      postInviteWheelSpin();
      setSpinFastTotate(true);
      setInviteWheelSpinToastFinish(false);
      resetSpinWheel();
    }
  }, [spinWheelCount, isLoading, inviteWheelSpinToastFinish]);

  useEffect(() => {
    return () => {
      setSpinFastTotate(false);
      setInviteWheelSpinToastFinish(true);
    };
  }, []);
};

export default useInviteSpinWheelBase;
