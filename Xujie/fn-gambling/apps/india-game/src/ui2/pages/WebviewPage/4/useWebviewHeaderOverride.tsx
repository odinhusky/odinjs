import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';

export const useWebviewHeaderOverride = () => {
  const thisPaths = [BasePagePathObj.GamePage, BasePagePathObj.GameLobbyPage];

  const location = useLocationStore((state) => state.location);
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (thisPaths.includes(location?.pathname || '')) {
      setConfig({
        type: EHeaderType.Null,
      });
    }
  }, [location]);
};

export default useWebviewHeaderOverride;
