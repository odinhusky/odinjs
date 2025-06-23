import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import { handleTeamDataDetailModalCloseBtnClick } from '@mode2/action/actionTypes';
import { HandleClickProps } from '../common/handleClickProps';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleTeamDataDetailModalCloseBtnClick]: void;
};

export interface HandleTeamDataDetailModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTeamDataDetailModalAction = () => {
  const setTeamDataDetailModalVisible = useTeamDataDetailModalStore(
    (state) => state.setTeamDataDetailModalVisible
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTeamDataDetailModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleTeamDataDetailModalCloseBtnClick,
        callback: () => {
          setTeamDataDetailModalVisible(false);
        },
      });
    },
  };

  const handleTeamDataDetailModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleTeamDataDetailModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleTeamDataDetailModalClick,
  };
};

export default useTeamDataDetailModalAction;
