import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick,
  handlepopPageRegitsterSuccessModalDownLoadAppBtnClick,
  handlepopPageRegitsterSuccessModalCloseIconClick,
  handlepopPageLecutreModalCloseIconClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import sdkUtils from '@libs/mode2/utils/sdk';
import usePopPageRegitsterSuccessModalStore from '@libs/mode2/zustand/page/PopPage';

type ActionClickPayloadMap = {
  [handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick]: void;
  [handlepopPageRegitsterSuccessModalDownLoadAppBtnClick]: void;
  [handlepopPageRegitsterSuccessModalCloseIconClick]: void;
  [handlepopPageLecutreModalCloseIconClick]: void;
};

export interface HandlePopPageActionProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const usePopPageAction = () => {
  const { navToHallPage } = useNavPageClick();

  const setShowPopPageRegitsterSuccessModal =
    usePopPageRegitsterSuccessModalStore(
      (state) => state.setShowPopPageRegitsterSuccessModal
    );

  const setShowPopPageLectrueModal = usePopPageRegitsterSuccessModalStore(
    (state) => state.setShowPopPageLectrueModal
  );

  const onRegisterSuccessModalClose = () => {
    setShowPopPageRegitsterSuccessModal(false);
  };

  const onLectureModalShow = () => {
    setShowPopPageLectrueModal(true);
  };

  const onLectureModalClose = () => {
    setShowPopPageLectrueModal(false);
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick]: () => {
      handleGlobalClick({
        target: handlepopPageRegitsterSuccessModalPlayInBrowserBtnClick,
        callback: () => {
          navToHallPage();
          onRegisterSuccessModalClose();
        },
      });
    },
    [handlepopPageRegitsterSuccessModalDownLoadAppBtnClick]: () => {
      handleGlobalClick({
        target: handlepopPageRegitsterSuccessModalDownLoadAppBtnClick,
        callback: () => {
          sdkUtils.downloadApp();
          onRegisterSuccessModalClose();
          onLectureModalShow();
        },
      });
    },
    [handlepopPageRegitsterSuccessModalCloseIconClick]: () => {
      handleGlobalClick({
        target: handlepopPageRegitsterSuccessModalCloseIconClick,
        callback: () => {
          onRegisterSuccessModalClose();
        },
      });
    },
    [handlepopPageLecutreModalCloseIconClick]: () => {
      handleGlobalClick({
        target: handlepopPageRegitsterSuccessModalCloseIconClick,
        callback: () => {
          onLectureModalClose();
        },
      });
    },
  };

  const handlePopPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandlePopPageActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handlePopPageClick,
  };
};

export default usePopPageAction;
