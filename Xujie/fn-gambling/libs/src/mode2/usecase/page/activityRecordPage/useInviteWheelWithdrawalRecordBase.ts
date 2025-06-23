import { useActivityRecordPageStore } from '@mode2/zustand/page/activityRecordPageStore';
import { usePostInviteWheelWithdrawListMutation } from '@mode2API/index';
import { useEffect } from 'react';

export const useInviteWheelWithdrawalRecordBase = () => {
  // const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);
  const [postInviteWheelWithdrawInformation, { data, isSuccess, isLoading }] =
    usePostInviteWheelWithdrawListMutation();
  // const initData = async () => {
  //   await postInviteWheelWithdrawInformation();
  // };

  const setInviteWithdrawalTotalRewards = useActivityRecordPageStore(
    (state) => state.setInviteWithdrawalTotalRewards
  );

  const setInviteWithdrawalHistoryList = useActivityRecordPageStore(
    (state) => state.setInviteWithdrawalHistoryList
  );

  const setIsTableLoading = useActivityRecordPageStore(
    (state) => state.setIsTableLoading
  );

  useEffect(() => {
    postInviteWheelWithdrawInformation();

    return () => {
      setInviteWithdrawalTotalRewards(0);
      setInviteWithdrawalHistoryList([]);
    };
  }, []);

  useEffect(() => {
    // 邀请轮盘
    if (isSuccess && data) {
      setInviteWithdrawalTotalRewards(data.totalRewards);
      setInviteWithdrawalHistoryList(data.inviteWithdrawList);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    setIsTableLoading(isLoading);
  }, [isLoading]);
};

export default useInviteWheelWithdrawalRecordBase;
