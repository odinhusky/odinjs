import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import useRechargeFooterSetting from './useRechargeFooterSetting';
import useRechargeWheelPageConfig from './useRechargeWheelPageConfig';
import useRechargeWheelPageHeaderSetting from './useRechargeWheelPageHeaderSetting';
import useRechargeWheelPlayerProgress from './useRechargeWheelPlayerProgress';
import useRechargeWheelPlayerSpin from './useRechargeWheelPlayerSpin';
import { useEffect } from 'react';

export const useMode2RechargeWheelPageBase = () => {
  const refreshPostPlayerProgressCount = useMode2RechargeWheelPageStore(
    (state) => state.refreshPostPlayerProgressCount
  );

  // ==== Recharge Wheel header setting
  useRechargeWheelPageHeaderSetting();

  // === Recharge Wheel Current Deposit & spinProgress
  useEffect(() => {
    refreshPostPlayerProgressCount();
  }, []);
  // useRechargeWheelPlayerProgress();

  // === Recharge Wheel Config
  useRechargeWheelPageConfig();

  // == Recharge Wheel Play the wheel
  useRechargeWheelPlayerSpin();

  // === Recharge Footer Setting
  useRechargeFooterSetting();

  // === Page FloatActionButton reset
  useMode2PageResetFloatActionButton();
};

export default useMode2RechargeWheelPageBase;
