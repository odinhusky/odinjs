import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import usePostTGActivityModalStore from '@libs/mode2/zustand/modal/PostTGActivityModal';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

// 出現時機應該也是根據後台控制的
export const usePostTGActivityModalBase = () => {
  const location = useLocationStore((state) => state.location);

  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowPostTGActivityModal = usePostTGActivityModalStore(
    (state) => state.setShowPostTGActivityModal
  );

  const appStartShownSeveralTimes = usePostTGActivityModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  // appStartShownSeveralTimes app 啟動後顯示過幾次，限制顯示一次，
  const onPostTGActivityShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowPostTGActivityModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }
      if (appStartShownSeveralTimes < 1) {
        setShowPostTGActivityModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('PostTGActivity');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.GIFT_CODE &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onPostTGActivityShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};

export default usePostTGActivityModalBase;
