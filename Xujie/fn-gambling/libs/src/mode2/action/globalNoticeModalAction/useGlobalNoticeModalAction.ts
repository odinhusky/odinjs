import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleGlobalNoticeModalActionClick,
  handleGlobalNoticeModalCloseClick,
} from '@mode2/action/actionTypes';
import useGlobalAnnouncementStore from '@mode2/zustand/modal/GlobalAnnouncementModal';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleGlobalNoticeModalCloseClick]: void;
  [handleGlobalNoticeModalActionClick]: { action: string };
};

export interface HandleGlobalNoticeModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useGlobalNoticeModalAction = () => {
  const setShowGlobalAnnouncementModal = useGlobalAnnouncementStore(
    (state) => state.setShowGlobalAnnouncementModal
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleGlobalNoticeModalCloseClick]: () => {
      handleGlobalClick({
        target: handleGlobalNoticeModalCloseClick,
        callback: () => {
          setShowGlobalAnnouncementModal(false);
          useModalLayoutStore.getState().verifyNextStep('GlobalNotice');
        },
      });
    },
    [handleGlobalNoticeModalActionClick]: ({ action }) => {
      handleGlobalClick({
        target: handleGlobalNoticeModalActionClick,
        callback: () => {
          setShowGlobalAnnouncementModal(false);
          // TODO action
        },
      });
    },
  };
  const handleGlobalNoticeModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleGlobalNoticeModalActionProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleGlobalNoticeModalClick,
  };
};

export default useGlobalNoticeModalAction;
