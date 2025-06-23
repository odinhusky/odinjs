import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useEffect } from 'react';
import { useActivityDetailPageStore } from '@mode2/zustand/page/ActivityDetailPage/useActivityDetailPageStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { AnnouncementType } from '@mode2/@types/announcementType';

export const useMobileActivityDetailPageOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const thisPath = BasePagePathObj.ActivityDetailPage;
  const location = useLocationStore((state) => state.location);

  const currentOrderId = useActivityDetailPageStore(
    (state) => state.currentOrderId
  );

  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );

  useEffect(() => {
    if (location?.pathname !== thisPath) {
      return;
    }
    const orderId = currentOrderId
      ? currentOrderId
      : location.state?.orderId || -1;

    const item = announcementsItems.find((item) => item.orderId === orderId);
    useActivityDetailPageStore
      .getState()
      .setCurrentAnnouncementType(item?.type || AnnouncementType.UNKNOWN);

    if (item) {
      useActivityDetailPageStore.getState().setCurrentDynamicContent({
        orderId: item.orderId,
        announcementType: item.type,
        bannerUrl: item.bannerUrl,
        title: item.title,
        innerHtml: item.innerHtml || '',
      });
    }

    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: item?.title || '' },
      templateBgColor: 'var(--background-dark)',
    });
  }, [location, currentOrderId, announcementsItems]);
};
