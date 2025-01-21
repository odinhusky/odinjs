import { usePostInviteWheelParticipateMutation } from '@libs/mode2/external/api';
import { usePinduoduoFreeDrawModalStore } from '@libs/mode2/zustand/components/pinduoduoFreeDrawModalStore';
import { useEffect } from 'react';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import useUpdatedEffect from 'antd/es/typography/hooks/useUpdatedEffect';

const usePinduoduoFreeDrawDataInit = () => {
  const [postInviteWheelParticipate, { data, isSuccess, isError }] =
    usePostInviteWheelParticipateMutation();
  const setRewardNum = usePinduoduoFreeDrawModalStore(
    (state) => state.setRewardNum
  );
  const participateNumber = usePinduoduoFreeDrawModalStore(
    (state) => state.participateNumber
  );
  const setIsRewardGetSuccess = usePinduoduoFreeDrawModalStore(
    (state) => state.setIsRewardGetSuccess
  );

  const isShowPinduoduoFreeDrawModal = useInviteWheelPageStoreStore(
    (state) => state.isShowPinduoduoFreeDrawModal
  );

  const setPinduoduoFreeDrawModalVisible = usePinduoduoFreeDrawModalStore(
    (state) => state.setPinduoduoFreeDrawModalVisible
  );

  const resetState = usePinduoduoFreeDrawModalStore(
    (state) => state.resetState
  );

  useDeepEffect(() => {
    if (isShowPinduoduoFreeDrawModal) {
      setPinduoduoFreeDrawModalVisible(true);
    }
  }, [isShowPinduoduoFreeDrawModal]);

  useUpdatedEffect(() => {
    if (participateNumber >= 0) {
      postInviteWheelParticipate();
    }
  }, [participateNumber]);

  useEffect(() => {
    if (isError) {
      resetState();
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data) {
      setIsRewardGetSuccess(1);
      setRewardNum(data.reward);
    }
  }, [isSuccess, data]);
};
export default usePinduoduoFreeDrawDataInit;
