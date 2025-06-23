import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';

export const useSearchGameHeaderOverride = () => {
  const thisPath = BasePagePathObj.SearchGamePage;
  const location = useLocationStore((state) => state.location);
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location?.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'Game search' },
        render: () => {
          return <></>;
        },
      });
    }
  }, [location]);
};

export default useSearchGameHeaderOverride;
