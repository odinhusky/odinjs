import useLeaveModalStore from '@libs/mode2/zustand/components/leaveModalStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import { handleLeaveModalBtnClick } from './actionType';
import { useNavigateClick } from '@libs/mode2/usecase/useNavPageClick';

enum LeaveModalBtnType {
  EXIT = 0, // 退出
  CONTINUE = 1, // 继续
}

type ActionClickPayloadMap = {
  [handleLeaveModalBtnClick]: {
    value: LeaveModalBtnType;
    page: string;
  };
};

export interface HandleLeaveModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useLeaveModalActions = () => {
  const navigate = useNavigateClick();
  const { setIsShowleaveModal } = useLeaveModalStore();

  const onLeave = (page: string) => {
    console.log(page);
    navigate(-1);
    setIsShowleaveModal(false);
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleLeaveModalBtnClick]: ({ value, page }) => {
      handleGlobalClick({
        target: handleLeaveModalBtnClick,
        callback: () => {
          console.log('@@===> handleLeaveModalLeaveClick', value);
          if (value === LeaveModalBtnType.EXIT) {
            console.log('back');
            onLeave(page);
          } else if (value === LeaveModalBtnType.CONTINUE) {
            setIsShowleaveModal(false);
          }
        },
      });
    },
  };

  const handleLeaveModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleLeaveModalOnEventProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleLeaveModalClick,
  };
};

export default useLeaveModalActions;
