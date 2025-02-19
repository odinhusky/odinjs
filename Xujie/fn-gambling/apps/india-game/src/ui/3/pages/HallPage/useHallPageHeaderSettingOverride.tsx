import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import InBoxButton from '@/ui/3/pages/HallPage/components/InBoxButton';
import LuckyWheelButton from '@/ui/3/pages/HallPage/components/LuckyWheelButton';

export const useHallPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Main,
      render: () => {
        return (
          <div className={' flex w-full gap-2 justify-end items-center'}>
            <LuckyWheelButton />
            <InBoxButton />
          </div>
        );
      },
    });
  }, []);
};

export default useHallPageHeaderSettingOverride;
