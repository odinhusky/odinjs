import { today } from '@libs/constant/date';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import useInviteWheelModalStore from '@libs/mode2/zustand/modal/InviteWheelModal';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { usePostPromoteInviteWheelMutation } from '@mode2API/index';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

export const useInviteWheelModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );
  const setShowInviteWheelModal = useInviteWheelModalStore(
    (state) => state.setShowInviteWheelModal
  );
  const appStartShownSeveralTimes = useInviteWheelModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const setIsNotShowToday = useInviteWheelModalStore(
    (state) => state.setIsNotShowToday
  );

  const setParameter = useInviteWheelModalStore((state) => state.setParameter);

  const [postPromoteInviteWheel, { data, isSuccess }] =
    usePostPromoteInviteWheelMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setParameter(data);
    }
  }, [data, isSuccess]);
  const showPopup = async () => {
    const value = await userLocalForage.getItem(
      UserLocalforageStoreKeys.INVITE_WHEEL_MODAL
    );
    const isShow = (value || 0) > today || !value ? true : false;
    return isShow;
  };

  // init
  useEffect(() => {
    return () => {
      setIsNotShowToday(false);
    };
  }, [location, appStartShownSeveralTimes]);

  // 邀請輪盤： {"withdrawRequire":500}
  const onInviteWheelShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowInviteWheelModal(true);
        // 顯示即獲取 parameter
        postPromoteInviteWheel();
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (appStartShownSeveralTimes < 1) {
        showPopup().then((isShow) => {
          if (isShow) {
            setShowInviteWheelModal(isShow);
            // 顯示即獲取 parameter
            postPromoteInviteWheel();
            hallAdModelInvoker.removeCache(command.uniqueId);
          } else {
            useModalLayoutStore.getState().verifyNextStep('InviteWheel');
          }
        });
      } else {
        useModalLayoutStore.getState().verifyNextStep('InviteWheel2');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.INVITE_WHEEL &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onInviteWheelShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);

  // return {
  //   isNotShowToday,
  //   isShowInviteWheelModal,
  //   handleClick,
  //   handleNavClick,
  //   checkBoxClick,
  // };
};
