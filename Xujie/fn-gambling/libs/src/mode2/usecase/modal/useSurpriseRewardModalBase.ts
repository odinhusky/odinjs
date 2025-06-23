import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import useSurpriseRewardModalStore from '@libs/mode2/zustand/modal/SurpriseRewardModal';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { usePostPromoteSurpriseRewardMutation } from '@mode2API/index';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

// 出現時機應該也是根據後台控制的
export const useSurpriseRewardModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowSurpriseRewardModal = useSurpriseRewardModalStore(
    (state) => state.setShowSurpriseRewardModal
  );
  const appStartShownSeveralTimes = useSurpriseRewardModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const setParameter = useSurpriseRewardModalStore(
    (state) => state.setParameter
  );

  const [postPromoteSurpriseReward, { data, isSuccess }] =
    usePostPromoteSurpriseRewardMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setParameter(data);
    }
  }, [data, isSuccess]);

  // appStartShownSeveralTimes app 啟動後顯示過幾次，限制顯示一次，
  // 驚喜獎勵：{"reward":27 , startTime:"20250304000000" , endTime:"20250305000000"}
  const onSurpriseRewardShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowSurpriseRewardModal(true);
        // 顯示即獲取 parameter
        postPromoteSurpriseReward();
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (appStartShownSeveralTimes < 1) {
        setShowSurpriseRewardModal(true);
        // 顯示即獲取 parameter
        postPromoteSurpriseReward();
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('SurpriseReward');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.SURPRISE_REWARD &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onSurpriseRewardShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};
