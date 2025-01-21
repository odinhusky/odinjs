import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { useEffect } from 'react';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';

export const useHallPageFABSetting = () => {
  const setFabConfig = useFloatActionButtonListStore(
    (state) => state.setFabConfig
  );
  useEffect(() => {
    setFabConfig({
      isFeatureSupport: true,
      isPermanentDisplay: false,
      isDraggable: false,
      isDrawerStyle: true,
      isShowRechargeWheelBtn: false,
      isShowMoneyBoxBtn: true,
      displayIcons: [
        'IN_BOX',
        ServicesTypeResult.LIVE_CHAT,
        ServicesTypeResult.WHATS_APP,
        ServicesTypeResult.TELEGRAM,
        ServicesTypeResult.INSTAGRAM,
        ServicesTypeResult.YOUTUBE,
      ],
    });
  }, []);
};
