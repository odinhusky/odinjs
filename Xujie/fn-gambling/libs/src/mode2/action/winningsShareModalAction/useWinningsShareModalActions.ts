import {
  handleWinningsShareCloseClick,
  handleWinningsShareSaveImageClick,
} from '@mode2/action/actionTypes';
import { HandleClickProps } from '../common/handleClickProps';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleGlobalClick from '../handleGlobalClick';
import handleAction from '../common/handleAction';
import { useDownloadSnapshotElement } from '@libs/commonUtils';
import { RefObject } from 'react';
import useWinningsShareModelStore from '@mode2/zustand/modal/WinningsShareModel';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleWinningsShareCloseClick]: void;
  [handleWinningsShareSaveImageClick]: {
    asImageRef: RefObject<HTMLDivElement>;
  };
};

export interface HandleWinningsShareModalClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWinningsShareModalActions = () => {
  const { downloadHtmlAsImage } = useDownloadSnapshotElement();

  const setShowWinningsShareModel = useWinningsShareModelStore(
    (state) => state.setShowWinningsShareModel
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleWinningsShareCloseClick]: () => {
      handleGlobalClick({
        target: handleWinningsShareCloseClick,
        callback: () => {
          setShowWinningsShareModel(false);
          useModalLayoutStore.getState().verifyNextStep('WinningsShareAction');
        },
      });
    },
    [handleWinningsShareSaveImageClick]: ({ asImageRef }) => {
      handleGlobalClick({
        target: handleWinningsShareSaveImageClick,
        callback: async () => {
          await downloadHtmlAsImage(
            asImageRef,
            import.meta.env['VITE_PACKAGENAME']
          );
          // showToast('Picture saved to album');
        },
      });
    },
  };

  const handleWinningsShareModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleWinningsShareModalClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleWinningsShareModalClick,
  };
};

export default useWinningsShareModalActions;
