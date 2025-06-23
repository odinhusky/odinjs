import { useTaskRewardsRecordContentStore } from '@mode2/zustand/components/taskRewardsRecordContentStore';
import { useEffect } from 'react';
import { usePostMissionHistoryMutation } from '@mode2API/index';
import { MissionHistoryPeriod } from '@mode2API/endpoint/mission/PostMissionHistoryEndpoint';

export const useTaskRewardsRecordContentBase = () => {
  const setPeriodTabs = useTaskRewardsRecordContentStore(
    (state) => state.setPeriodTabs
  );
  const currentTab = useTaskRewardsRecordContentStore(
    (state) => state.currentTab
  );

  const setTotalAmount = useTaskRewardsRecordContentStore(
    (state) => state.setTotalAmount
  );

  const setRewardList = useTaskRewardsRecordContentStore(
    (state) => state.setRewardList
  );

  const reset = useTaskRewardsRecordContentStore((state) => state.reset);

  const [postMissionHistory, { data, isSuccess }] =
    usePostMissionHistoryMutation();

  useEffect(() => {
    setPeriodTabs([
      {
        i18nKey: '1 Day', // TODO Evan i18n
        period: MissionHistoryPeriod.TODAY,
        daysAgo: 0,
      },
      {
        i18nKey: '7 Days', // TODO Evan i18n
        period: MissionHistoryPeriod.THIS_WEEK,
        daysAgo: 7,
      },
      {
        i18nKey: '30 Days', // TODO Evan i18n
        period: MissionHistoryPeriod.THIS_MONTH,
        daysAgo: 30,
      },
    ]);

    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    postMissionHistory({
      period: currentTab.period,
    });
  }, [currentTab]);

  useEffect(() => {
    if (data && isSuccess) {
      setTotalAmount(data.totalRewardAmount);

      setRewardList(data.rewardList.filter((item) => item.rewardAmount > 0));
    }
  }, [data, isSuccess]);
};

export default useTaskRewardsRecordContentBase;
