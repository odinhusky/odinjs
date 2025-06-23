import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useDeepEffect } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

/**
 * Evan for [V6] main 控制
 */
export const useMobileExclusiveMainOverride = () => {
  const location = useLocationStore((state) => state.location);
  const setMainStyle = useTemplateLayoutStore((state) => state.setMainStyle);

  useDeepEffect(() => {
    switch (location?.pathname) {
      case BasePagePathObj.SharePage:
        setMainStyle({
          backgroundImage: `url(${getImgUrl(EResourceLevel.V, 'pattern')})`,
          backgroundPosition: 'top left',
          backgroundSize: '40rem 40rem',
          backgroundAttachment: 'scroll',
        });
        break;

      case BasePagePathObj.FeedBackPage:
      case BasePagePathObj.InboxDetailPage:
        setMainStyle({
          backgroundColor: 'var(--background-light2)',
        });
        break;

      default:
        setMainStyle({
          backgroundColor: '',
        });
    }
  }, [location]);
};

export default useMobileExclusiveMainOverride;
