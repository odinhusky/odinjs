import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleBonusAnnounceCloseClick,
  handleBonusAnnounceItemClick,
} from '@mode2/action/bonusAnnounceModelAction/actionType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { AnnouncementType } from '@mode2/@types/announcementType';
import useAnnouncementActionBase, {
  AnnouncementScenariosType,
} from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { useMode2HallPageModalStore } from '@mode2/zustand/page/hallPageStore';

type ActionClickPayloadMap = {
  [handleBonusAnnounceItemClick]: { type: AnnouncementType };
  [handleBonusAnnounceCloseClick]: void;
};

export interface BonusAnnounceModelClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useBonusAnnounceModelActions = () => {
  const { onAnnouncementAction } = useAnnouncementActionBase();
  const setIsShowBonusModal = useMode2HallPageModalStore(
    (state) => state.setIsShowBonusModal
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBonusAnnounceItemClick]: ({ type }) => {
      handleGlobalClick({
        target: handleBonusAnnounceItemClick,
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.POPUP, { type: type });
        },
      });
    },
    [handleBonusAnnounceCloseClick]: () => {
      handleGlobalClick({
        target: handleBonusAnnounceCloseClick,
        callback: () => {
          setIsShowBonusModal(false);
        },
      });
    },
  };

  const handleBonusAnnounceModelClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: BonusAnnounceModelClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleBonusAnnounceModelClick,
  };
};

export default useBonusAnnounceModelActions;
