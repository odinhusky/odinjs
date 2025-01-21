import { useEffect } from 'react';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';

export const useMode2PageResetFloatActionButton = (
  shouldReset: boolean = true
) => {
  const resetConfig = useFloatActionButtonListStore(
    (state) => state.resetConfig
  );
  useEffect(() => {
    if (shouldReset) {
      resetConfig();
    }
  }, []);
};
