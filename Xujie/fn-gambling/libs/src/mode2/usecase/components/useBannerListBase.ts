import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import {
  AnnouncementItem,
  useMode2BannerStore,
} from '@mode2/zustand/page/hallPageStore';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { useDeepEffect } from '@libs/commonUtils';

export const useBannerListBase = () => {
  const announcementsItems = usePlatformNotifyStore(
    (state) => state.announcementsItems
  );
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const setBannerList = useMode2BannerStore((state) => state.setBannerList);

  useDeepEffect(() => {
    if (isNil(announcementsItems)) return;

    let list: AnnouncementItem[] = [];

    if (
      announcementsItems &&
      isArray(announcementsItems) &&
      !isEmpty(announcementsItems)
    ) {
      const cloneBannerList = announcementsItems
        .filter((item) => {
          return (
            item.type !=
            (isFirstDeposit
              ? AnnouncementType.RECHARGING
              : AnnouncementType.FIRST_CHARGE)
          );
        })
        .map((item: AnnouncementResult) => {
          return {
            ...cloneDeep(item),
          };
        });

      list = cloneBannerList;
    }

    setBannerList(list);
  }, [announcementsItems, isFirstDeposit]);
};

export default useBannerListBase;
