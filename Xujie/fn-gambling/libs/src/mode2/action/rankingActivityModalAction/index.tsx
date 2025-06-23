import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleRankingActivityFirstChargeModalNotShowTodayClick,
  handleRankingActivityModalClose,
  handleRankingActivityModalGetMoneyBtnClick,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import useRankingActivityModalStore from '@libs/mode2/zustand/modal/RankingActivityModal';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import dayjs from '@commonUtils/localizedDayjs';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

export interface RankingActivityShowTimeData {
  // expTime: number; // 剩餘時間 // 不需要紀錄剩餘時間，有可能倒數是從後端來的
  closeTime: number; // 記錄上一次關閉彈窗時間
  disableDuration: number; // 紀錄 當天是否在顯示，禁用到多久
}

type ActionClickPayloadMap = {
  [handleRankingActivityFirstChargeModalNotShowTodayClick]: { value: boolean };
  [handleRankingActivityModalClose]: void;
  [handleRankingActivityModalGetMoneyBtnClick]: void;
};

export interface HandleFirstChargeModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useRankingActivityModalAction = () => {
  const setIsNotShowToday = useRankingActivityModalStore(
    (state) => state.setIsNotShowToday
  );

  const setShowRankingActivityModal = useRankingActivityModalStore(
    (state) => state.setShowRankingActivityModal
  );

  const updateAppStartShownSeveralTimes = useRankingActivityModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const rankingActivityStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.RANKING_ACTIVITY
  );

  const { navToRankingPage } = useNavPageClick();

  // 紀錄當下的時間以及今天是否要再顯示
  const recordShowTimeData = async () => {
    const isNotShowToday =
      useRankingActivityModalStore.getState().isNotShowToday;
    const userId = useUserProfileStore.getState().id;
    // const countdownTime = useRankingActivityModalStore.getState().countdownTime;

    // console.log('!! isNotShowToday', isNotShowToday);
    // console.log('!! userId', userId);
    // console.log('!! countdownTime', countdownTime);

    const data: RankingActivityShowTimeData = {
      // expTime: countdownTime + dayjs().unix(),
      closeTime: dayjs().unix(), // 剩餘時間
      disableDuration: isNotShowToday ? dayjs().startOf('day').unix() : 0,
    };

    rankingActivityStore.setItem(
      userId.toString(),
      sdkUtils.encryption(JSON.stringify(data))
    );
  };

  const handleModalClose = (isNext: boolean = true) => {
    updateAppStartShownSeveralTimes();
    setShowRankingActivityModal(false);

    // 紀錄是否今天內要再顯示
    recordShowTimeData();

    // 關閉modal 必須呼要下一個
    if (isNext) hallAdModelInvoker.executeNext();
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRankingActivityFirstChargeModalNotShowTodayClick]: ({ value }) => {
      handleGlobalClick({
        target: handleRankingActivityFirstChargeModalNotShowTodayClick,
        payload: { value },
        callback: () => {
          setIsNotShowToday(value);
        },
      });
    },
    [handleRankingActivityModalClose]: async () => {
      handleGlobalClick({
        target: handleRankingActivityModalClose,
        callback: () => {
          handleModalClose();
        },
      });
    },
    [handleRankingActivityModalGetMoneyBtnClick]: () => {
      handleGlobalClick({
        target: handleRankingActivityModalGetMoneyBtnClick,
        callback: () => {
          handleModalClose();
          navToRankingPage();
        },
      });
    },
  };

  const handleRankingActivityModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleFirstChargeModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRankingActivityModalClick,
  };
};

export default useRankingActivityModalAction;
