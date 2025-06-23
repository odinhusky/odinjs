import { useEffect } from 'react';
import { usePostPromotePrizeWheelMutation } from '@mode2API/index';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';
import isEmpty from 'lodash/isEmpty';
import { PrizeWheelType } from '@mode2/@types/prizeWheelType';
import {
  RECHARGE_ZONE_DEG,
  RECHARGE_ZONE_DEG_OFFSET,
} from '@libs/constant/wheelConst';

export const useRefreshDepositJackpotWheelInfoBase = () => {
  const [postPromotePrizeWheel, { data, isSuccess }] =
    usePostPromotePrizeWheelMutation();

  const refreshDepositJackpotWheel = useDepositJackpotWheelModalStore(
    (state) => state.refreshDepositJackpotWheel
  );

  const refreshDepositJackpotWheelCount = useDepositJackpotWheelModalStore(
    (state) => state.refreshDepositJackpotWheelCount
  );

  const isShowDepositJackpotWheelModal = useDepositJackpotWheelModalStore(
    (state) => state.isShowDepositJackpotWheelModal
  );

  const setDepositJackpotWheelSpinList = useDepositJackpotWheelModalStore(
    (state) => state.setDepositJackpotWheelSpinList
  );

  const setDepositJackpotWheelRemainSpin = useDepositJackpotWheelModalStore(
    (state) => state.setDepositJackpotWheelRemainSpin
  );

  const setDoubleBuffRechargeBonusLimitedEndTime =
    useDepositJackpotWheelModalStore(
      (state) => state.setDoubleBuffRechargeBonusLimitedEndTime
    );

  const setPrizeWheelType = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelType
  );
  const setPrizeWheelIndex = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelIndex
  );
  const setLastPrizeWheelRotate = useDepositJackpotWheelModalStore(
    (state) => state.setLastPrizeWheelRotate
  );

  const setSpinAnimationFinish = useDepositJackpotWheelModalStore(
    (state) => state.setSpinAnimationFinish
  );
  const setStartSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.setStartSpinAnimation
  );

  useEffect(() => {
    if (refreshDepositJackpotWheelCount > 0) {
      postPromotePrizeWheel();
    }
  }, [refreshDepositJackpotWheelCount]);

  useEffect(() => {
    if (isShowDepositJackpotWheelModal) {
      setSpinAnimationFinish(false);
      setStartSpinAnimation(false);
      refreshDepositJackpotWheel();
    } else {
      setPrizeWheelType(PrizeWheelType.NONE);
      setPrizeWheelIndex(-1);
      setLastPrizeWheelRotate(0);
    }
  }, [isShowDepositJackpotWheelModal]);

  useEffect(() => {
    if (isSuccess && !isEmpty(data)) {
      setDepositJackpotWheelSpinList(data.wheelSegments);
      setDepositJackpotWheelRemainSpin(data.remainSpin);
      setDoubleBuffRechargeBonusLimitedEndTime(
        data.doubleBuffRechargeBonusLimitedEndTime
      );
      // data.lastSpinPrizeId 存在，指針停留在 data.wheelSegments 對應 index 下，不存在為-1
      const index = data.lastSpinPrizeId
        ? data.wheelSegments.findIndex(
            (segment) => segment.id === data.lastSpinPrizeId
          )
        : -1;
      setPrizeWheelIndex(index);

      const lastSpinPrizeId = index >= 0 && index <= 7 ? index : 0;
      // 角度變量範圍只能是[0 ~ 7]
      const rotate =
        90 +
        (lastSpinPrizeId * -RECHARGE_ZONE_DEG + -RECHARGE_ZONE_DEG_OFFSET) +
        -66;
      setLastPrizeWheelRotate(rotate);
    }
  }, [data, isSuccess]);
};

export default useRefreshDepositJackpotWheelInfoBase;
