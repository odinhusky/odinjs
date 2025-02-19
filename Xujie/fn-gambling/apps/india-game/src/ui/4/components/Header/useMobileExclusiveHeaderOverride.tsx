import { useLocationStore } from '@mode2/zustand/locationStore';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useDeepEffect } from '@libs/commonUtils';

/**
 * Evan for [V6]  Header控制
 */
export const useMobileExclusiveHeaderOverride = () => {
  const location = useLocationStore((state) => state.location);
  const config = useHeaderStore((state) => state.config);
  const setConfig = useHeaderStore((state) => state.setConfig);
  useDeepEffect(() => {
    switch (location?.pathname) {
      case BasePagePathObj.HallPage:
      case BasePagePathObj.ActivityPage:
        setConfig({
          ...config,
          headerBgColor: 'bgi-[var(--background-dark)]',
        });
        break;
      case BasePagePathObj.InviteWheelPage:
      case BasePagePathObj.WalletPage:
      case BasePagePathObj.RecordPage:
      case BasePagePathObj.FeedBackPage:
      case BasePagePathObj.ActivityRecordPage:
        setConfig({
          ...config,
          type: `${EHeaderType.Common}`,
        });
        break;

      case BasePagePathObj.TeamClubPage:
        setConfig({
          ...config,
          type: `${EHeaderType.Empty}`,
        });
        break;
      case BasePagePathObj.MyPage:
        setConfig({
          ...config,
          type: `${EHeaderType.CenterTitle}`,
        });
        break;
      case BasePagePathObj.GameLobbyPage:
      case BasePagePathObj.GamePage:
        setConfig({
          ...config,
          headerBgColor: 'bgi-[var(--background-dark)]',
        });
        break;
    }
  }, [location, config]);
};

export default useMobileExclusiveHeaderOverride;
