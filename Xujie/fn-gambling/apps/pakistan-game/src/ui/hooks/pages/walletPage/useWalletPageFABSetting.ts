import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { useEffect } from 'react';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';

export const useWalletPageFABSetting = () => {
  const setFabConfig = useFloatActionButtonListStore(
    (state) => state.setFabConfig
  );
  useEffect(() => {
    setFabConfig({
      isFeatureSupport: true,
      isPermanentDisplay: true,
      isDraggable: true,
      isDrawerStyle: false,
      isShowRechargeWheelBtn: false,
      isShowMoneyBoxBtn: false,
      displayIcons: [ServicesTypeResult.LIVE_CHAT],
    });
  }, []);
};
