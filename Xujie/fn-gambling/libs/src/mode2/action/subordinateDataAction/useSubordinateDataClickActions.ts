import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  handleSubordinateDataDisplayDatePickerClick,
  handleSubordinateDataLevelClick,
  handleSubordinateDataMobileInputValueChange,
  handleSubordinateDataMobileSearchClick,
  handleSubordinateDataSortByCommissionClick,
  handleSubordinateDataSortByJoinTimeClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { useShowDatePickerStore } from '@libs/mode2/zustand/DatePickerStore';

export const ORDER = {
  ASC: 1, // 升序
  DESC: -1, // 降序
  DEFAULT: 0, // 默认
};
export type OrderType = (typeof ORDER)[keyof typeof ORDER];
const orderValues = [ORDER.DEFAULT, ORDER.ASC, ORDER.DESC];
const toggleOrder = (currentOrderIndex: OrderType) => {
  currentOrderIndex = (currentOrderIndex + 1) % orderValues.length;
  return orderValues[currentOrderIndex];
};

type ActionClickPayloadMap = {
  [handleSubordinateDataLevelClick]: { value: number; hasMember: boolean };
  [handleSubordinateDataSortByJoinTimeClick]: void;
  [handleSubordinateDataSortByCommissionClick]: void;
  [handleSubordinateDataDisplayDatePickerClick]: { isShow: boolean };
  [handleSubordinateDataMobileInputValueChange]: { value: string };
  [handleSubordinateDataMobileSearchClick]: void;
};

export interface HandleSubordinateDataClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSubordinateDataClickActions = () => {
  const setSortByTier = useMode2SubordinateDataPageStore(
    (state) => state.setSortByTier
  );
  const mobile = useMode2SubordinateDataPageStore((state) => state.mobile);
  const sortByJoinTime = useMode2SubordinateDataPageStore(
    (state) => state.sortByJoinTime
  );
  const setSortByJoinTime = useMode2SubordinateDataPageStore(
    (state) => state.setSortByJoinTime
  );
  const sortByCommission = useMode2SubordinateDataPageStore(
    (state) => state.sortByCommission
  );
  const setSortByCommission = useMode2SubordinateDataPageStore(
    (state) => state.setSortByCommission
  );
  const setMobile = useMode2SubordinateDataPageStore(
    (state) => state.setMobile
  );
  const refreshUserData = useMode2SubordinateDataPageStore(
    (state) => state.refreshUserData
  );
  const setDatePicker = useShowDatePickerStore((state) => state.setDatePicker);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSubordinateDataLevelClick]: ({ value, hasMember }) => {
      handleGlobalClick({
        target: handleSubordinateDataLevelClick,
        payload: { value, hasMember },
        callback: () => {
          if (hasMember) {
            refreshUserData();
          }
          setSortByTier(value);
          setMobile('');
        },
      });
    },
    [handleSubordinateDataSortByJoinTimeClick]: () => {
      handleGlobalClick({
        target: handleSubordinateDataSortByJoinTimeClick,
        callback: () => {
          const index = toggleOrder(sortByJoinTime);
          setSortByJoinTime(index);
          setSortByCommission(ORDER.DEFAULT);
        },
      });
    },
    [handleSubordinateDataSortByCommissionClick]: () => {
      handleGlobalClick({
        target: handleSubordinateDataSortByCommissionClick,
        callback: () => {
          const index = toggleOrder(sortByCommission);
          setSortByCommission(index);
          setSortByJoinTime(ORDER.DEFAULT);
        },
      });
    },
    [handleSubordinateDataDisplayDatePickerClick]: ({ isShow }) => {
      handleGlobalClick({
        target: handleSubordinateDataDisplayDatePickerClick,
        payload: { isShow },
        callback: () => {
          setDatePicker(isShow);
          setSortByJoinTime(ORDER.DEFAULT);
          setSortByCommission(ORDER.DEFAULT);
          setMobile('');
        },
      });
    },
    [handleSubordinateDataMobileInputValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleSubordinateDataMobileInputValueChange,
        payload: { value },
        callback: () => {
          setMobile(value);
          setSortByJoinTime(ORDER.DEFAULT);
          setSortByCommission(ORDER.DEFAULT);
        },
      });
    },
    [handleSubordinateDataMobileSearchClick]: () => {
      handleGlobalClick({
        target: handleSubordinateDataMobileInputValueChange,
        callback: () => {
          setMobile(mobile);
          setSortByJoinTime(ORDER.DEFAULT);
          setSortByCommission(ORDER.DEFAULT);
        },
      });
    },
  };

  const handleSubordinateDataClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSubordinateDataClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSubordinateDataClick,
  };
};

export default useSubordinateDataClickActions;
