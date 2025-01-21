import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { useEffect } from 'react';

export const usePageResetFloatActionButton = (shouldReset: boolean = true) => {
  const resetConfig = useFloatActionButtonListStore(
    (state) => state.resetConfig
  );
  useEffect(() => {
    if (shouldReset) {
      resetConfig();
    }
  }, []);
};
