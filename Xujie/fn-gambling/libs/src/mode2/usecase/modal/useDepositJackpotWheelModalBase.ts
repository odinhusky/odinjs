import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocationStore } from '@libs/mode2/zustand/locationStore';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@libs/mode2/zustand/template/modalLayoutStore';
import { useCallback, useEffect } from 'react';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import { usePostWheelPrizeSpinMutation } from '@libs/mode2/external/api';
import isEmpty from 'lodash/isEmpty';
import { PrizeWheelType } from '@libs/mode2/@types/prizeWheelType';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import { SourceFrom } from '../announcement/command/HallAdModelCommand';

export const useDepositJackpotWheelModalBase = () => {
  const location = useLocationStore((state) => state.location);
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const spinWheelCount = useDepositJackpotWheelModalStore(
    (state) => state.spinWheelCount
  );
  const depositJackpotWheelSpinList = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelSpinList
  );

  const refreshDepositJackpotWheel = useDepositJackpotWheelModalStore(
    (state) => state.refreshDepositJackpotWheel
  );

  const setShowDepositJackpotWheelModal = useDepositJackpotWheelModalStore(
    (state) => state.setShowDepositJackpotWheelModal
  );

  const resetSpinWheel = useDepositJackpotWheelModalStore(
    (state) => state.resetSpinWheel
  );

  const setPrizeWheelIndex = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelIndex
  );
  const setPrizeWheelName = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelName
  );
  const setPrizeWheelType = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelType
  );

  const spinAnimationFinish = useDepositJackpotWheelModalStore(
    (state) => state.spinAnimationFinish
  );

  const setSpinAnimationFinish = useDepositJackpotWheelModalStore(
    (state) => state.setSpinAnimationFinish
  );

  const startSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.startSpinAnimation
  );

  const setStartSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.setStartSpinAnimation
  );

  const setPrizeWheelIcon = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelIcon
  );

  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const [
    postWheelPrizeSpin,
    {
      reset: resetPrizeSpin,
      data: prizeSpinData,
      isSuccess: isPrizeSuccess,
      isLoading: isPrizeLoading,
    },
  ] = usePostWheelPrizeSpinMutation();

  const onDepositJackpotWheelModalShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      // 來源是否在允許範圍內
      const isFromAllow = [
        SourceFrom.IMMEDIATE,
        SourceFrom.WEB_SOCKET,
      ].includes(command.from);

      if (isFromAllow) {
        setShowDepositJackpotWheelModal(true);
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore
          .getState()
          .verifyNextStep('DepositJackpotWheelShowAction');
      }
    },
    []
  );

  // spin 動畫結束
  useEffect(() => {
    if (spinAnimationFinish) {
      resetPrizeSpin();
      // 延後改變  setStartSpinAnimation 避免未顯示結果又點擊了 spin
      useDepositJackpotWheelModalStore
        .getState()
        .setIsShowDepositJackpotWheelRewardModal(true);
      setTimeout(() => {
        setSpinAnimationFinish(false);
        setStartSpinAnimation(false);
      }, 500);
    }
  }, [spinAnimationFinish]);

  useEffect(() => {
    if (isPrizeSuccess && !isEmpty(prizeSpinData)) {
      if (prizeSpinData.type === PrizeWheelType.DEPOSIT_BONUS) {
        refreshDepositJackpotWheel();
      }
      if (prizeSpinData.type === PrizeWheelType.CASH) {
        refreshUserData();
      }

      // 得獎的 id 找出 對應的 index name type
      const data = depositJackpotWheelSpinList.filter(
        (item) => item.id === prizeSpinData.id
      );
      const prizeSegmentIndex = depositJackpotWheelSpinList.findIndex(
        (item) => item.id === prizeSpinData.id
      );
      console.log(
        '@@@===> useDepositJackpotWheelModalStore spin result',
        data,
        prizeSegmentIndex
      );

      setPrizeWheelIndex(prizeSegmentIndex || -1);
      setPrizeWheelName(data[0]?.name || '');
      setPrizeWheelType(data[0]?.type || PrizeWheelType.NONE);
      setPrizeWheelIcon(data[0]?.icon || 0);
      setStartSpinAnimation(true);
    }
  }, [prizeSpinData, isPrizeSuccess]);

  useEffect(() => {
    if (isPrizeLoading) {
      return;
    }

    if (spinWheelCount == 1 && !startSpinAnimation) {
      postWheelPrizeSpin();
      resetSpinWheel();
    }
  }, [spinWheelCount, isPrizeLoading, startSpinAnimation]);

  useEffect(() => {
    if (
      hallAdModelCommandTypes.type === AnnouncementType.DEPOSIT_JACKPOT_WHEEL &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onDepositJackpotWheelModalShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes, location]);
};

export default useDepositJackpotWheelModalBase;
