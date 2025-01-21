import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useMode2ActivitySwitchPageStore } from '@libs/mode2/zustand/page/activityPageStore';
import { useEffect } from 'react';

export const useActivityPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Main,
    });
  }, []);
};

export default useActivityPageHeaderSetting;
