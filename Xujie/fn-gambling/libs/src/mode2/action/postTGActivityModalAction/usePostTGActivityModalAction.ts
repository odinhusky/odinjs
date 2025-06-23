import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handlePostTGActivityModalCloseBtnClick,
  handlePostTGActivityModalImgClick,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import usePostTGActivityModalStore from '@libs/mode2/zustand/modal/PostTGActivityModal';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handlePostTGActivityModalImgClick]: void;
  [handlePostTGActivityModalCloseBtnClick]: void;
};

export interface HandleFirstChargeModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const usePostTGActivityModalAction = () => {
  const { navToGiftCodeRedeemPage } = useNavPageClick();

  const setShowPostTGActivityModal = usePostTGActivityModalStore(
    (state) => state.setShowPostTGActivityModal
  );

  const updateAppStartShownSeveralTimes = usePostTGActivityModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const handleClose = () => {
    updateAppStartShownSeveralTimes();
    setShowPostTGActivityModal(false);
    // 關閉modal 必須呼要下一個
    useModalLayoutStore.getState().verifyNextStep('PostTGActivityAction');
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handlePostTGActivityModalImgClick]: () => {
      handleGlobalClick({
        target: handlePostTGActivityModalImgClick,
        callback: () => {
          navToGiftCodeRedeemPage();

          // 加上這裡是為了從優惠碼頁面回來時，不會再次顯示該Modal
          updateAppStartShownSeveralTimes();
          setShowPostTGActivityModal(false);
        },
      });
    },
    [handlePostTGActivityModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handlePostTGActivityModalCloseBtnClick,
        callback: () => {
          handleClose();
        },
      });
    },
  };

  const handlePostTGActivityModalClick = <
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
    handlePostTGActivityModalClick,
  };
};

export default usePostTGActivityModalAction;
