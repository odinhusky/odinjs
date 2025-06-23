import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import useDailyRebateModalStore from '@libs/mode2/zustand/modal/DailyRebateModal';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { usePostPromoteVipRebateMutation } from '@mode2API/index';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

export const useDailyRebateModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowDailyRebateModal = useDailyRebateModalStore(
    (state) => state.setShowDailyRebateModal
  );
  const appStartShownSeveralTimes = useDailyRebateModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const setParameter = useDailyRebateModalStore((state) => state.setParameter);

  const [postPromoteVipRebate, { data, isSuccess }] =
    usePostPromoteVipRebateMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setParameter(data);
    }
  }, [data, isSuccess]);

  // 投注返水：{"betTime":1741026973 , "bets":678124 , "rebate": 275.81}
  const onDailyRebateShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowDailyRebateModal(true);
        // 顯示即獲取 parameter
        postPromoteVipRebate();
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (appStartShownSeveralTimes < 1) {
        setShowDailyRebateModal(true);
        // 顯示即獲取 parameter
        postPromoteVipRebate();
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('DailyRebate');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.VIP_REBATE &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onDailyRebateShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};
