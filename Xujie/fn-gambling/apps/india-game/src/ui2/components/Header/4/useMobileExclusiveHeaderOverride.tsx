import { useLocationStore } from '@mode2/zustand/locationStore';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useDeepEffect } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

/**
 * Evan for [V6] Header控制
 */
export const useMobileExclusiveHeaderOverride = () => {
  const location = useLocationStore((state) => state.location);
  const config = useHeaderStore((state) => state.config);
  const setConfig = useHeaderStore((state) => state.setConfig);
  useDeepEffect(() => {
    switch (location?.pathname) {
      case BasePagePathObj.GameLobbyPage:
      case BasePagePathObj.GamePage:
      case BasePagePathObj.HallPage:
        setConfig({
          ...config,
          headerBgColor: '',
          headerBgImg: getImgUrl(EResourceLevel.V, 'homepage_pattern'),
          headerBgStyle: {
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            // maxWidth: '750px',
            // marginLeft: 'auto',
            // marginRight: 'auto',
          },
        });
        break;
      case BasePagePathObj.RechargeWheelPage:
        setConfig({
          ...config,
          headerBgColor: '',
          headerBgImg: getImgUrl(EResourceLevel.V, 'casino_background'),
        });
        break;
      case BasePagePathObj.InviteWheelPage:
        setConfig({
          ...config,
          type: `${EHeaderType.Common}`,
          headerBgColor: 'bgi-[var(--linear-12)]',
          headerBgImg: getImgUrl(
            EResourceLevel.V,
            'invitation_wheel_background_1'
          ),
          headerBgStyle: {
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          },
        });
        break;
      case BasePagePathObj.ActivityPage:
        setConfig({
          ...config,
          headerBgColor: 'bgi-[var(--background-dark)]',
        });
        break;
      case BasePagePathObj.WalletPage:
      case BasePagePathObj.RecordPage:
      case BasePagePathObj.FeedBackPage:
      case BasePagePathObj.ActivityRecordPage:
      case BasePagePathObj.SearchGamePage:
        // case BasePagePathObj.RechargeWheelPage:
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
    }
  }, [location, config]);
};

export default useMobileExclusiveHeaderOverride;
