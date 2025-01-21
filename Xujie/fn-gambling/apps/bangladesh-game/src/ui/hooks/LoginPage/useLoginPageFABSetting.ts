import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { useEffect } from 'react';

export const useLoginPageFABSetting = () => {
  const setFabConfig = useFloatActionButtonListStore(
    (state) => state.setFabConfig
  );
  useEffect(() => {
    setFabConfig({
      isFeatureSupport: false,
      isPermanentDisplay: false,
      isDraggable: false,
      isDrawerStyle: false,
      isShowRechargeWheelBtn: false,
      isShowMoneyBoxBtn: false,
      displayIcons: [],
    });
  }, []);
};
