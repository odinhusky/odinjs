import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '../../handleGlobalClick';
import {
  handleDynamicActivityModalCloseClickAction,
  handleDynamicActivityModalNavButtonClick,
} from '@mode2/action/actionTypes';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { useActivityDetailPageStore } from '@mode2/zustand/page/ActivityDetailPage/useActivityDetailPageStore';
import useDynamicActivityModalStore from '@mode2/zustand/modal/DynamicActivityModal';
import { AnnouncementType } from '@mode2/@types/announcementType';

type ActionClickPayloadMap = {
  [handleDynamicActivityModalCloseClickAction]: {
    uniqueId: string;
    orderId: number;
  };
  [handleDynamicActivityModalNavButtonClick]: {
    uniqueId: string;
    orderId: number;
  };
};

export interface HandleDynamicActivityModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useDynamicActivityModalAction = () => {
  const { navToActivityDetailPage } = useNavPageClick();

  const setShowDynamicActivityModal = useDynamicActivityModalStore(
    (state) => state.setShowDynamicActivityModal
  );

  const updateAppStartShownSeveralTimes = useDynamicActivityModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleDynamicActivityModalCloseClickAction]: ({ uniqueId, orderId }) => {
      handleGlobalClick({
        target: handleDynamicActivityModalCloseClickAction,
        payload: { uniqueId, orderId },
        callback: () => {
          updateAppStartShownSeveralTimes(uniqueId);
          setShowDynamicActivityModal(false);
          setTimeout(() => {
            useModalLayoutStore
              .getState()
              .verifyNextStep('DynamicActivityAction');
          }, 200);
        },
      });
    },
    [handleDynamicActivityModalNavButtonClick]: ({ uniqueId, orderId }) => {
      handleGlobalClick({
        target: handleDynamicActivityModalNavButtonClick,
        payload: { uniqueId, orderId },
        callback: () => {
          updateAppStartShownSeveralTimes(uniqueId);
          setShowDynamicActivityModal(false);
          useActivityDetailPageStore.getState().setCurrentOrderId(orderId);
          navToActivityDetailPage('', {
            state: {
              tab: AnnouncementType.DYNAMIC_ACTIVITY,
              orderId: orderId,
            },
          });
        },
      });
    },
  };
  const handleDynamicActivityModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleDynamicActivityModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleDynamicActivityModalClick,
  };
};
