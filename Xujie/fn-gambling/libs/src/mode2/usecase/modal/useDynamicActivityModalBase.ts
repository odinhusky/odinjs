import { useCallback, useEffect } from 'react';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useDynamicActivityModalStore from '@mode2/zustand/modal/DynamicActivityModal';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';

export const useDynamicActivityModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowDynamicActivityModal = useDynamicActivityModalStore(
    (state) => state.setShowDynamicActivityModal
  );

  const setCurrentUniqueId = useDynamicActivityModalStore(
    (state) => state.setCurrentUniqueId
  );

  const currentUniqueId = useDynamicActivityModalStore(
    (state) => state.currentUniqueId
  );

  const appStartShownSeveralTimes = useDynamicActivityModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );

  useEffect(() => {
    const item = announcementsItems.find(
      (item) => item.id === Number(currentUniqueId)
    );
    if (item) {
      useDynamicActivityModalStore.getState().setCurrentDynamicContent({
        uniqueId: item?.id ? `${item?.id}` : '-1',
        orderId: item?.orderId || -1,
        announcementType: item?.type || AnnouncementType.UNKNOWN,
        popupBannerUrl: item?.popupBannerUrl || '',
        popupTitle: item?.title || '',
        popupInnerHtml: item?.popupInnerHtml || '',
      });
    }
  }, [currentUniqueId, announcementsItems]);

  const onDynamicActivityShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // const mataData: { id?: number } = JSON.parse(
      //   command.parameterJson || '{}'
      // );

      if (command.from === SourceFrom.WEB_SOCKET) {
        setCurrentUniqueId('-1');
        setShowDynamicActivityModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }
      const isShown = appStartShownSeveralTimes.includes(command.uniqueId);
      if (!isShown) {
        setCurrentUniqueId(command.uniqueId);
        setShowDynamicActivityModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        setCurrentUniqueId('-1');
        useModalLayoutStore.getState().verifyNextStep('DynamicActivity');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.DYNAMIC_ACTIVITY &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onDynamicActivityShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};
