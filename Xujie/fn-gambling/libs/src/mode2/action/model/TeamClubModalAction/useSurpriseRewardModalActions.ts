import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';

import useTeamClubModalStore from '@libs/mode2/zustand/modal/TeamClubModal';
import handleGlobalClick from '../../handleGlobalClick';
import {
  handleTeamClubModalCloseClickAction,
  handleTeamClubModalBtnClickAction,
} from '@mode2/action/actionTypes';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleTeamClubModalCloseClickAction]: void;
  [handleTeamClubModalBtnClickAction]: void;
};

export interface HandleTeamClubModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTeamClubModalActions = () => {
  const { navToTeamClubPage } = useNavPageClick();

  const setShowTeamClubModal = useTeamClubModalStore(
    (state) => state.setShowTeamClubModal
  );

  const updateAppStartShownSeveralTimes = useTeamClubModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTeamClubModalCloseClickAction]: () => {
      handleGlobalClick({
        target: handleTeamClubModalCloseClickAction,
        callback: () => {
          updateAppStartShownSeveralTimes();
          setShowTeamClubModal(false);
          useModalLayoutStore.getState().verifyNextStep('TeamClubAction');
        },
      });
    },
    [handleTeamClubModalBtnClickAction]: () => {
      handleGlobalClick({
        target: handleTeamClubModalBtnClickAction,
        callback: () => {
          updateAppStartShownSeveralTimes();
          setShowTeamClubModal(false);
          navToTeamClubPage();
        },
      });
    },
  };

  const handleTeamClubModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleTeamClubModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleTeamClubModalClick,
  };
};
