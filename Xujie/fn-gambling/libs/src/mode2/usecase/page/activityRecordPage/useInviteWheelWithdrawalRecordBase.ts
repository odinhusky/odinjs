import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@mode2/zustand/page/activityRecordPageStore';
import { usePostInviteWheelWithdrawListMutation } from '@mode2API/index';
import { useEffect } from 'react';

export const useInviteWheelWithdrawalRecordBase = () => {
  // const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);
  const [postInviteWheelWithdrawInformation, { data, isSuccess }] =
    usePostInviteWheelWithdrawListMutation();
  // const initData = async () => {
  //   await postInviteWheelWithdrawInformation();
  // };

  const setInviteWithdrawalHistoryList = useActivityRecordPageStore(
    (state) => state.setInviteWithdrawalHistoryList
  );

  useEffect(() => {
    postInviteWheelWithdrawInformation();
  }, []);

  useEffect(() => {
    // 邀请轮盘
    if (isSuccess && data) {
      setInviteWithdrawalHistoryList(data.inviteWithdrawList);
    }
  }, [isSuccess, data]);
};

export default useInviteWheelWithdrawalRecordBase;
