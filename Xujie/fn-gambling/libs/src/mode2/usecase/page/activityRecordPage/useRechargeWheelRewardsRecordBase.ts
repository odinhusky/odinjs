import {
  SortNameTypes,
  useActivityRecordPageStore,
} from '@mode2/zustand/page/activityRecordPageStore';
import { usePostWheelPlayerSpinHistoryListMutation } from '@mode2API/index';
import { WheelSpinHistoryResult } from '@mode2API/endpoint/wheel/PostWheelPlayerSpinHistoryListEndpoint';
import { useEffect } from 'react';

export const useRechargeWheelRewardsRecordBase = () => {
  const listSort = useActivityRecordPageStore((state) => state.listSort);
  const [postWheelPlayerSpinHistoryInformation, { data, isSuccess }] =
    usePostWheelPlayerSpinHistoryListMutation();

  const setRechargeRewardRecordList = useActivityRecordPageStore(
    (state) => state.setRechargeRewardRecordList
  );
  const setTotalRewards = useActivityRecordPageStore(
    (state) => state.setTotalRewards
  );

  const sortDatas = (list: WheelSpinHistoryResult[]) => {
    const newList = [...list];
    if (listSort.sortIndex === 1) {
      if (listSort.sortName === SortNameTypes.SPIN_TIME) {
        return newList.sort((a, b) => b.createTime - a.createTime);
      } else {
        return newList.sort((a, b) => b.rewards - a.rewards);
      }
    }
    if (listSort.sortIndex === 2) {
      if (listSort.sortName === SortNameTypes.SPIN_TIME) {
        return newList.sort((a, b) => a.createTime - b.createTime);
      } else {
        return newList.sort((a, b) => a.rewards - b.rewards);
      }
    }
    return newList;
  };

  useEffect(() => {
    postWheelPlayerSpinHistoryInformation();
  }, []);

  useEffect(() => {
    // 充值轮盘
    if (isSuccess && data) {
      const totalRewards = data.totalRewards;
      const list = data.wheelSpinHistoryList;
      setRechargeRewardRecordList(sortDatas(list));
      setTotalRewards(totalRewards);
    }
  }, [data, isSuccess, listSort]);
};

export default useRechargeWheelRewardsRecordBase;
