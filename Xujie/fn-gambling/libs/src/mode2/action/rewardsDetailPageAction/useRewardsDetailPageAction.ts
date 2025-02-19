import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import {
  RewardsDetailPageHeaderTabsTypes,
  useRewardsDetailStore,
} from '@libs/mode2/zustand/page/rewardsDetailStore';
import { handleRewardsDetailPageHeaderTypeClick } from './actionType';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleRewardsDetailPageHeaderTypeClick]: {
    value: RewardsDetailPageHeaderTabsTypes;
  };
};

export interface HandleRewardsDetailPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRewardsDetailPageAction = () => {
  const setHeaderTabIndex = useRewardsDetailStore(
    (state) => state.setHeaderTabIndex
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRewardsDetailPageHeaderTypeClick]: ({ value }) => {
      handleGlobalClick({
        target: handleRewardsDetailPageHeaderTypeClick,
        callback: () => {
          setHeaderTabIndex(value);
        },
      });
    },
  };

  const handleRewardsDetailPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRewardsDetailPageOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRewardsDetailPageClick,
  };
};

export default useRewardsDetailPageAction;
