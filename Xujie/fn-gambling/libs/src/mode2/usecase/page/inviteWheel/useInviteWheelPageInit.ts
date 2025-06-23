import { useEffect } from 'react';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import {
  usePostInviteWheelNewsTickerListMutation,
  usePostInviteWheelPortalInfoMutation,
  usePostInviteWheelRewardListMutation,
} from '@libs/mode2/external/api';
import { useDeepEffect } from '@libs/commonUtils';
import { usePinduoduoFreeDrawModalStore } from '@mode2/zustand/components/pinduoduoFreeDrawModalStore';
import { useUpdateDeepEffect } from '@libs/commonUtils';

const useInviteWheelPageInit = () => {
  const [postInviteWheelNewsTickerList, { data: newsTicker }] =
    usePostInviteWheelNewsTickerListMutation();
  const [postInviteWheelRewardList, { data: inviteWheelRewardListData }] =
    usePostInviteWheelRewardListMutation();
  const [postInviteWheelPortalInfo, { data: inviteWheelPortalInfo }] =
    usePostInviteWheelPortalInfoMutation();

  const setMarqueeText = useInviteWheelPageStoreStore(
    (state) => state.setMarqueeText
  );

  const setInviteWheelPortalInfo = useInviteWheelPageStoreStore(
    (state) => state.setInviteWheelPortalInfo
  );

  const setInviteWheelSpinRecord = useInviteWheelPageStoreStore(
    (state) => state.setInviteWheelSpinRecord
  );

  // tips modal 用
  const setRequireCumulativeAmount = useInviteWheelPageStoreStore(
    (state) => state.setRequireCumulativeAmount
  );
  const setWithdrawCompletionRate = useInviteWheelPageStoreStore(
    (state) => state.setWithdrawCompletionRate
  );
  const setCashOutRewardDifference = useInviteWheelPageStoreStore(
    (state) => state.setCashOutRewardDifference
  );

  const setParticipated = useInviteWheelPageStoreStore(
    (state) => state.setParticipated
  );

  const refreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.refreshInfoNumber
  );

  const setRefreshInfoNumber = useInviteWheelPageStoreStore(
    (state) => state.setRefreshInfoNumber
  );

  const setInviteWithdrawRequire = useInviteWheelPageStoreStore(
    (state) => state.setInviteWithdrawRequire
  );
  const setInviteDamaRatio = useInviteWheelPageStoreStore(
    (state) => state.setInviteDamaRatio
  );
  const resetState = useInviteWheelPageStoreStore((state) => state.resetState);

  const pinduoduoFreeDrawModalVisible = usePinduoduoFreeDrawModalStore(
    (state) => state.pinduoduoFreeDrawModalVisible
  );

  useEffect(() => {
    if (inviteWheelRewardListData) {
      setInviteWheelSpinRecord(inviteWheelRewardListData.rewardList);
    }
  }, [inviteWheelRewardListData]);

  useEffect(() => {
    if (newsTicker) {
      setMarqueeText(newsTicker.newsTickerList);
    }
  }, [newsTicker]);

  useEffect(() => {
    if (inviteWheelPortalInfo) {
      setRequireCumulativeAmount(inviteWheelPortalInfo.withdrawRequire);
      setWithdrawCompletionRate(inviteWheelPortalInfo.completionRate);
      setCashOutRewardDifference(inviteWheelPortalInfo.remainingReward);
      setParticipated(inviteWheelPortalInfo.isParticipated);
      setInviteWheelPortalInfo(inviteWheelPortalInfo);
      setInviteWithdrawRequire(inviteWheelPortalInfo.effectiveRechargeAmount);
      setInviteDamaRatio(inviteWheelPortalInfo.rewardDamaTimes);
    }
  }, [inviteWheelPortalInfo]);

  // 關閉拼多多獎勵Modal時 刷新資料
  useDeepEffect(() => {
    if (!pinduoduoFreeDrawModalVisible) {
      setRefreshInfoNumber();
    }
  }, [pinduoduoFreeDrawModalVisible]);

  // 第一次金入不刷新
  // 刷新
  useUpdateDeepEffect(() => {
    postInviteWheelPortalInfo();
    postInviteWheelRewardList();
  }, [refreshInfoNumber]);

  useDeepEffect(() => {
    postInviteWheelNewsTickerList();
  }, []);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);
};

export default useInviteWheelPageInit;
