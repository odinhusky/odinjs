import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { useCallback, useEffect } from 'react';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { useLocationStore } from '@mode2/zustand/locationStore';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';
import { BasePagePathObj } from '@mode2/routerTypes/types';

import { PostHogFeatureTypes } from '@libs/mode2/utils/sdk/strategy/analytics/PostHogAnalytics';
import dayjs from 'dayjs';
import { usePostBrokenBoxInfoMutation } from '@mode2API/index';
import posthog from 'posthog-js';

export const useLowBalanceRescueBoxModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const isShowLowBalanceRescueBoxModal = useLowBalanceRescueBoxModalStore(
    (state) => state.isShowLowBalanceRescueBoxModal
  );

  const setShowLowBalanceRescueBoxModal = useLowBalanceRescueBoxModalStore(
    (state) => state.setShowLowBalanceRescueBoxModal
  );

  const setLowBalanceRewardInfo = useLowBalanceRescueBoxModalStore(
    (state) => state.setLowBalanceRewardInfo
  );

  const lowBalanceRescueBoxLimitedOffersEndTime =
    useLowBalanceRescueBoxModalStore(
      (state) => state.lowBalanceRescueBoxLimitedOffersEndTime
    );

  const [postBrokenBoxInfo, { data, isSuccess }] =
    usePostBrokenBoxInfoMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setLowBalanceRewardInfo(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isShowLowBalanceRescueBoxModal) {
      postBrokenBoxInfo();
    }
  }, [isShowLowBalanceRescueBoxModal]);

  // NOTE Evan 出現時機只限於  [WEB_SOCKET or IMMEDIATE]
  const onLowBalanceRescueBoxShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // 如果是 socket
      const lowBalanceRescueBoxEnabled = posthog.isFeatureEnabled(
        PostHogFeatureTypes.lowBalanceRescueBox.flag
      );
      console.log(
        '@@@===>PostHogFeature.lowBalanceRescueBox',
        lowBalanceRescueBoxEnabled
      );
      if (
        [SourceFrom.IMMEDIATE, SourceFrom.WEB_SOCKET].includes(command.from) &&
        lowBalanceRescueBoxLimitedOffersEndTime > dayjs().unix() &&
        lowBalanceRescueBoxEnabled
      ) {
        setShowLowBalanceRescueBoxModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        // NOTE Evan 因為會到處出現，必須判斷如果在首頁出現 非 [SourceFrom.IMMEDIATE, SourceFrom.WEB_SOCKET]
        // 預期外從 SourceFrom.ANNOUNCEMENTS 出現，防呆避免其它 Modal 無法順序出現問題
        if (location?.pathname === BasePagePathObj.HallPage) {
          useModalLayoutStore
            .getState()
            .verifyNextStep('LowBalanceRechargeShowAction');
        }
      }
    },
    [location, lowBalanceRescueBoxLimitedOffersEndTime]
  );

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.LOW_BALANCE_RESCUE_BOX
    ) {
      onLowBalanceRescueBoxShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};

export default useLowBalanceRescueBoxModalBase;
