import { usePostPiggyBankDetailMutation } from '@mode2API/index';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { useCallback, useEffect } from 'react';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useMobileExclusiveMoneyBoxBase = () => {
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const [postPiggyBankDetail, { data, isSuccess }] =
    usePostPiggyBankDetailMutation();

  const setCurrentCash = useRebateRewardModalStore(
    (state) => state.setCurrentCash
  );

  const isShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.isShowRebateRewardModal
  );

  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );
  const appStartShownSeveralTimes = useRebateRewardModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  useEffect(() => {
    if (isShowRebateRewardModal) {
      postPiggyBankDetail();
    }
  }, [isShowRebateRewardModal]);

  useEffect(() => {
    if (isSuccess && data) {
      setCurrentCash(data.amount);
      if (data.amount > 0) {
        setIsShowRebateRewardModal(true);
      } else {
        useModalLayoutStore.getState().verifyNextStep('MoneyBoxBase');
      }
    }
  }, [data, isSuccess]);

  const onMoneyBoxShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      const userRole = useUserProfileStore.getState().userRole;
      if (
        [SourceFrom.WEB_SOCKET, SourceFrom.IMMEDIATE].includes(command.from) &&
        userRole !== UserRoleType.GUEST
      ) {
        setIsShowRebateRewardModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (appStartShownSeveralTimes < 1 && userRole !== UserRoleType.GUEST) {
        setIsShowRebateRewardModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('MoneyBox');
      }
    },
    [appStartShownSeveralTimes]
  );

  useEffect(() => {
    const location = useLocationStore.getState().location;
    if (
      hallAdModelCommandTypes.type === AnnouncementType.PIGGY_BANK &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onMoneyBoxShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};
