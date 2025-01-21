import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useMemo } from 'react';
import { AnnouncementType } from '@mode2/@types/announcementType';

export const useBonusAnnounceModelBase = () => {
  const carouselItems = usePlatformNotifyStore((state) => state.carouselItems);
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const carouselList = useMemo(() => {
    const items = carouselItems.filter((item) => {
      return (
        item.type !=
        (isFirstDeposit
          ? AnnouncementType.RECHARGING
          : AnnouncementType.FIRST_CHARGE)
      );
    });
    return items;
  }, [carouselItems, isFirstDeposit]);
  return {
    carouselList,
  };
};

export default useBonusAnnounceModelBase;
