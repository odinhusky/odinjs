import { handleBeforeRechargeNoticeModalCloseBtnClick } from '@mode2/action/actionTypes';
import { useRechargeNoticeModalStore } from '@libs/mode2/zustand/components/rechargeNoticeModalStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import dayjs from '@commonUtils/localizedDayjs';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleBeforeRechargeNoticeModalCloseBtnClick]: { value: boolean };
};

export interface HandleBeforeRechargeNoticeModalProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useBeforeRechargeNoticeModalAction = () => {
  const setRechargeNoticeModalVisible = useRechargeNoticeModalStore(
    (state) => state.setRechargeNoticeModalVisible
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBeforeRechargeNoticeModalCloseBtnClick]: ({ value }) => {
      handleGlobalClick({
        target: handleBeforeRechargeNoticeModalCloseBtnClick,
        payload: { value },
        callback: () => {
          if (value) {
            const currentTime = dayjs().endOf('day').add(1, 'second').unix();
            sdkUtils.setStorage(
              AppLocalStorageKey.RECHARGE_NOTICE_POPUP,
              `${currentTime}`
            );
          }
          setRechargeNoticeModalVisible(false);
        },
      });
    },
  };

  const handleBeforeRechargeNoticeModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleBeforeRechargeNoticeModalProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleBeforeRechargeNoticeModalClick,
  };
};

export default useBeforeRechargeNoticeModalAction;
