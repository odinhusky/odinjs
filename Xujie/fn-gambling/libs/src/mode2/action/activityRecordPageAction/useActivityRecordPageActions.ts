import { handleActivityRecordPageTaskPeriodTabsClick } from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  PeriodTab,
  useTaskRewardsRecordContentStore,
} from '@mode2/zustand/components/taskRewardsRecordContentStore';

type ActionClickPayloadMap = {
  [handleActivityRecordPageTaskPeriodTabsClick]: { tab: PeriodTab };
};

export interface HandleActivityRecordPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useActivityRecordPageActions = () => {
  const setCurrentTab = useTaskRewardsRecordContentStore(
    (state) => state.setCurrentTab
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleActivityRecordPageTaskPeriodTabsClick]: ({ tab }) => {
      handleGlobalClick({
        target: handleActivityRecordPageTaskPeriodTabsClick,
        payload: { tab },
        callback: () => {
          setCurrentTab(tab);
        },
      });
    },
  };

  const handleActivityRecordPageClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleActivityRecordPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleActivityRecordPageClick,
  };
};

export default useActivityRecordPageActions;
